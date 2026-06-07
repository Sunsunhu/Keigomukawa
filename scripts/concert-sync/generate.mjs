// Génère public/js/concerts-data.js depuis le site japonais officiel.
//
// Pipeline :
//   1. Scrape /concert/ (à venir) + /concert-archive/ (passés).
//   2. Pour chaque concert, applique soit l'override manuel (clé = ID WordPress),
//      soit une traduction (dictionnaires + traduction auto en cache).
//   3. Écrit le fichier au format historique attendu par main.js, en préservant
//      l'ordre (à venir : chronologique ; passés : antéchronologique).
//
// Les concerts déjà traduits à la main (overrides.json) ne sont jamais dégradés :
// seul le statut « complet » (soldOut) est resynchronisé depuis le site source.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scrapeUpcoming, scrapePast } from './scrape.mjs';
import { translateArea, translateDow, formatTimes } from './dictionaries.mjs';
import { loadCache, saveCache, translateBatch, makeSyncTranslator } from './translate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const OVERRIDES_PATH = resolve(__dirname, 'overrides.json');
const CACHE_PATH = resolve(__dirname, 'translation-cache.json');
const OUTPUT_PATH = resolve(ROOT, 'public', 'js', 'concerts-data.js');

const LANGS = [
  { key: 'fr', index: 0 },
  { key: 'en', index: 1 },
];

function loadOverrides() {
  if (!existsSync(OVERRIDES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

// Construit la chaîne « venue » d'un concert pour une langue donnée.
function buildVenue(item, langIndex, translate) {
  const area = translateArea(item.areaJa, { translateText: translate });
  const areaStr = langIndex === 0 ? area.fr : area.en;
  const hall = item.hallJa ? translate(item.hallJa, langIndex === 0 ? 'fr' : 'en') : '';
  const times = formatTimes(item.startJa, langIndex);
  let s = areaStr || '';
  if (hall) s += `${s ? ' — ' : ''}${hall}`;
  if (times) s += `${s ? ' · ' : ''}${times}`;
  return s;
}

// Transforme un item scrapé en entrée finale, override prioritaire.
function toEntry(item, langKey, langIndex, overrides, translate) {
  const ov = overrides[item.id];
  const day = translateDow(item.dowJa, langIndex);
  const entry = {
    date: item.date,
    day,
    dayNum: item.dayNum,
    venue:
      ov && ov[langKey] && ov[langKey].venue
        ? ov[langKey].venue
        : buildVenue(item, langIndex, translate),
    title:
      ov && ov[langKey] && ov[langKey].title
        ? ov[langKey].title
        : translate(item.titleJa, langKey),
  };
  if (item.soldOut) entry.soldOut = true;
  return entry;
}

function byDateAsc(a, b) {
  return toComparable(a.date) - toComparable(b.date);
}
function byDateDesc(a, b) {
  return toComparable(b.date) - toComparable(a.date);
}
function toComparable(d) {
  const [dd, mm, yyyy] = d.split('.');
  return Number(`${yyyy}${mm}${dd}`);
}

function serialize(data) {
  // Sortie déterministe (pas d'horodatage volatil) : ainsi le job horaire ne
  // committe QUE lorsqu'une donnée change réellement. La date de mise à jour
  // est tracée par l'historique Git.
  return (
    `/* Généré automatiquement depuis keigomukawa.com — NE PAS MODIFIER À LA MAIN.\n` +
    `   Régénéré chaque heure par scripts/concert-sync (GitHub Action).\n` +
    `   Pour corriger/ajuster une traduction, éditez scripts/concert-sync/overrides.json. */\n` +
    `window.CONCERTS_DATA = ${JSON.stringify(data, null, 2)};\n`
  );
}

export async function generate({ log = console.log } = {}) {
  log('→ Scraping keigomukawa.com…');
  const [upcoming, past] = await Promise.all([scrapeUpcoming(), scrapePast()]);
  log(`  ${upcoming.length} concerts à venir, ${past.length} concerts passés.`);

  const overrides = loadOverrides();
  const cache = loadCache(CACHE_PATH);

  // Ne traduire automatiquement QUE le texte libre des concerts sans override.
  const needsTranslation = [];
  for (const item of [...upcoming, ...past]) {
    if (overrides[item.id]) continue;
    if (item.hallJa) needsTranslation.push(item.hallJa);
    if (item.titleJa) needsTranslation.push(item.titleJa);
    // Lieux/villes inconnus du dictionnaire : on les ajoute aussi.
    if (item.areaJa) needsTranslation.push(item.areaJa);
  }
  const stats = await translateBatch(needsTranslation, cache, { log });
  log(`  Traduction auto : ${stats.translated} chaîne(s) via ${stats.provider}.`);
  saveCache(CACHE_PATH, cache);

  const translate = makeSyncTranslator(cache);

  const data = {};
  for (const { key, index } of LANGS) {
    data[key] = {
      upcoming: [...upcoming]
        .sort(byDateAsc)
        .map((it) => toEntry(it, key, index, overrides, translate)),
      past: [...past]
        .sort(byDateDesc)
        .map((it) => toEntry(it, key, index, overrides, translate)),
    };
  }

  writeFileSync(OUTPUT_PATH, serialize(data));
  log(`✓ Écrit ${OUTPUT_PATH}`);
  return { upcoming: upcoming.length, past: past.length, ...stats };
}

// Exécution directe : `node scripts/concert-sync/generate.mjs`
// (comparaison via chemin réel : robuste aux espaces dans le chemin)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generate().catch((err) => {
    console.error('✗ Échec de la génération des concerts :', err);
    process.exit(1);
  });
}
