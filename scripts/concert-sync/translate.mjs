// Traduction automatique optionnelle (japonais → FR / EN) avec cache sur disque.
//
// Fournisseurs supportés (par ordre de priorité, selon les variables d'env.) :
//   - DeepL  : DEEPL_API_KEY            (les clés gratuites finissent par « :fx »)
//   - Google : GOOGLE_TRANSLATE_API_KEY
//
// Sans clé, la traduction renvoie le texte source japonais : dégradation propre.
// Le cache (translation-cache.json) est versionné → on ne paie/refait jamais
// deux fois la même chaîne, et les traductions restent stables.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export function loadCache(path) {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveCache(path, cache) {
  const sorted = {};
  for (const k of Object.keys(cache).sort()) sorted[k] = cache[k];
  writeFileSync(path, JSON.stringify(sorted, null, 2) + '\n');
}

function hasJapanese(s) {
  return /[\u3040-\u30ff\u3400-\u9fff\uff66-\uff9f]/.test(s || '');
}

async function deeplTranslate(text, targetLang, key) {
  const host = key.trim().endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const body = new URLSearchParams({
    text,
    source_lang: 'JA',
    target_lang: targetLang.toUpperCase(), // FR / EN
  });
  const res = await fetch(`${host}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${key.trim()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) throw new Error(`DeepL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.translations?.[0]?.text ?? text;
}

async function googleTranslate(text, targetLang, key) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'ja', target: targetLang, format: 'text' }),
    }
  );
  if (!res.ok) throw new Error(`Google HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data?.translations?.[0]?.translatedText ?? text;
}

function getProvider() {
  const deepl = process.env.DEEPL_API_KEY;
  if (deepl) return { name: 'deepl', fn: (t, l) => deeplTranslate(t, l, deepl) };
  const google = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (google) return { name: 'google', fn: (t, l) => googleTranslate(t, l, google) };
  return null;
}

// Traduit toutes les chaînes manquantes vers FR + EN et remplit le cache.
// Renvoie { provider, translated, skipped } pour le journal.
export async function translateBatch(strings, cache, { log = console.log } = {}) {
  const provider = getProvider();
  const unique = [...new Set(strings.filter((s) => s && hasJapanese(s)))];
  const langs = ['fr', 'en'];

  // Sans fournisseur : on ne touche PAS au cache. Le traducteur synchrone
  // retombera sur le texte source ; ainsi, ajouter une clé plus tard permettra
  // de traduire réellement (pas de « pollution » du cache par du japonais).
  if (!provider) {
    return { provider: 'aucun (texte japonais conservé)', translated: 0, skipped: unique.length };
  }

  let translated = 0;
  for (const text of unique) {
    cache[text] = cache[text] || {};
    for (const lang of langs) {
      if (cache[text][lang]) continue; // déjà en cache → on ne repaie pas
      try {
        cache[text][lang] = await provider.fn(text, lang);
        translated++;
      } catch (err) {
        // Échec : on NE met PAS en cache, pour réessayer au prochain passage.
        log(`  ⚠ traduction échouée (${lang}) « ${text} » : ${err.message}`);
      }
    }
  }

  return { provider: provider.name, translated, skipped: unique.length };
}

// Fabrique un traducteur synchrone basé sur le cache (utilisé par les dictionnaires).
export function makeSyncTranslator(cache) {
  return (text, lang) => {
    if (!text) return text;
    const entry = cache[text];
    if (entry && entry[lang]) return entry[lang];
    return text; // fallback : texte source
  };
}
