// Amorçage unique de overrides.json à partir des traductions déjà soignées
// dans public/js/concerts-data.js.
//
// On apparie chaque concert scrapé (clé = ID WordPress stable) avec l'entrée
// française/anglaise existante, par date puis par ordre d'apparition. Le résultat
// garantit que les concerts actuels conservent EXACTEMENT leurs textes actuels ;
// seuls les concerts futurs ajoutés sur le site japonais seront traduits auto.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scrapeUpcoming, scrapePast } from './scrape.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const EXISTING_PATH = resolve(ROOT, 'public', 'js', 'concerts-data.js');
const OVERRIDES_PATH = resolve(__dirname, 'overrides.json');

function loadExisting() {
  const src = readFileSync(EXISTING_PATH, 'utf-8');
  const sandbox = { window: {} };
  // eslint-disable-next-line no-new-func
  new Function('window', src)(sandbox.window);
  return sandbox.window.CONCERTS_DATA;
}

// Paires {date, fr:{venue,title}, en:{venue,title}} depuis les tableaux parallèles.
function buildPairs(existing) {
  const pairs = [];
  for (const list of ['upcoming', 'past']) {
    const fr = existing.fr[list] || [];
    const en = existing.en[list] || [];
    for (let i = 0; i < fr.length; i++) {
      pairs.push({
        date: fr[i].date,
        fr: { venue: fr[i].venue, title: fr[i].title },
        en: { venue: (en[i] || fr[i]).venue, title: (en[i] || fr[i]).title },
      });
    }
  }
  return pairs;
}

function groupByDate(pairs) {
  const map = new Map();
  for (const p of pairs) {
    if (!map.has(p.date)) map.set(p.date, []);
    map.get(p.date).push(p);
  }
  return map;
}

async function main() {
  const existing = loadExisting();
  const pairs = buildPairs(existing);
  const byDate = groupByDate(pairs);

  const [upcoming, past] = await Promise.all([scrapeUpcoming(), scrapePast()]);
  const scraped = [...upcoming, ...past];

  // Dates portant plusieurs concerts (ordre d'appariement à vérifier).
  const multiDateDates = new Set(
    [...byDate.entries()].filter(([, b]) => b.length > 1).map(([d]) => d)
  );

  const overrides = {};
  let matched = 0;
  const unmatchedScraped = [];

  for (const item of scraped) {
    const bucket = byDate.get(item.date);
    if (bucket && bucket.length) {
      const pair = bucket.shift();
      overrides[item.id] = { fr: pair.fr, en: pair.en };
      matched++;
    } else {
      unmatchedScraped.push(item);
    }
  }

  const leftover = [];
  for (const [date, bucket] of byDate) {
    for (const p of bucket) leftover.push({ date, venue: p.fr.venue });
  }

  writeFileSync(OVERRIDES_PATH, JSON.stringify(sortById(overrides), null, 2) + '\n');

  console.log(`✓ overrides.json écrit : ${matched} concert(s) appariés.`);
  console.log(`  Concerts scrapés sans correspondance (seront traduits auto) : ${unmatchedScraped.length}`);
  unmatchedScraped.forEach((i) => console.log(`    + ${i.date}  ${i.areaJa} / ${i.titleJa}`));
  console.log(`  Entrées existantes non utilisées (concerts disparus du site JP) : ${leftover.length}`);
  leftover.forEach((l) => console.log(`    - ${l.date}  ${l.venue}`));
  if (multiDateDates.size) {
    console.log(`  ⚠ Dates avec plusieurs concerts (à vérifier dans le diff) : ${[...multiDateDates].join(', ')}`);
  }
}

function sortById(obj) {
  const out = {};
  for (const k of Object.keys(obj).sort((a, b) => Number(a) - Number(b))) out[k] = obj[k];
  return out;
}

main().catch((err) => {
  console.error('✗ Échec de l\'amorçage :', err);
  process.exit(1);
});
