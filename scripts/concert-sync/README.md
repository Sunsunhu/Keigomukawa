# Synchronisation automatique des concerts

Met à jour **`public/js/concerts-data.js`** à partir du site japonais officiel
[keigomukawa.com](https://keigomukawa.com) — source unique de vérité.

Une **GitHub Action** (`.github/workflows/update-concerts.yml`) lance la
synchronisation **toutes les heures**. S'il y a un changement (nouveau concert,
statut « complet », passage à venir → passé…), elle committe et pousse
automatiquement, ce qui déclenche un redéploiement Vercel. Sinon, elle ne fait
rien.

## Ce qui est automatique

- Récupération des concerts **à venir** (`/concert/`) et **passés**
  (`/concert-archive/`, toutes les pages).
- Tri (à venir : chronologique ; passés : antéchronologique) et passage
  automatique d'un concert de « à venir » à « passé » (géré par le site source).
- Statut **« complet »** (`soldOut`) resynchronisé à chaque passage.
- Traduction des champs **structurés** (préfectures, pays, jours de la semaine,
  horaires, mention « complet ») via des dictionnaires déterministes.

## Traduction du texte libre (salles, titres)

Stratégie **hybride**, pour ne jamais dégrader la qualité existante :

1. **Overrides manuels** — `overrides.json` associe chaque concert (clé = ID
   WordPress stable du site japonais) à ses textes FR/EN soignés. **Priorité
   absolue.** Tous les concerts déjà en ligne y figurent : ils restent identiques.
2. **Traduction automatique** (optionnelle) — pour un concert **nouveau** sans
   override, la salle et le titre sont traduits via une API (résultat mis en
   cache dans `translation-cache.json`, donc payé/calculé une seule fois).
3. **Repli** — sans clé d'API, le texte japonais est conservé tel quel en
   attendant une traduction (le reste — lieu, date, horaires — est déjà traduit).

### Activer la traduction automatique (recommandé)

Dans le dépôt GitHub : **Settings → Secrets and variables → Actions → New
repository secret**, ajoutez **l'un** des deux :

| Secret                     | Fournisseur | Remarque                                            |
| -------------------------- | ----------- | --------------------------------------------------- |
| `DEEPL_API_KEY`            | DeepL       | Recommandé. Clés gratuites : suffixe `:fx` (500k/mois). |
| `GOOGLE_TRANSLATE_API_KEY` | Google      | Alternative.                                        |

Aucune clé n'est nécessaire pour que la synchronisation fonctionne : seuls les
champs libres des **nouveaux** concerts resteraient en japonais jusqu'à
traduction.

### Corriger / soigner une traduction à la main

Éditez **`overrides.json`**. Trouvez (ou créez) l'entrée par l'ID WordPress du
concert (visible dans l'URL de détail, ex. `…/concert/1467/` → clé `"1467"`) :

```json
"1467": {
  "fr": { "venue": "Miyagi, Japon — Taihaku Hall Natori, salle moyenne · Ouverture 13:30 · 14:00", "title": "Keigo Mukawa — Récital de piano 2026" },
  "en": { "venue": "Miyagi, Japan — Taihaku Hall Natori, medium hall · Doors 13:30 · 14:00", "title": "Keigo Mukawa — Piano recital 2026" }
}
```

L'override l'emporte toujours sur la traduction automatique et n'est jamais
écrasé par la synchronisation.

## Commandes locales

```bash
npm run concerts:sync   # régénère public/js/concerts-data.js depuis le site JP
npm run concerts:seed   # (one-shot) reconstruit overrides.json depuis le fichier actuel
```

## Fichiers

| Fichier                  | Rôle                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `scrape.mjs`             | Récupère et analyse les pages concerts du site japonais.    |
| `dictionaries.mjs`       | Traductions déterministes (préfectures, pays, jours…).      |
| `translate.mjs`          | Traduction automatique optionnelle (DeepL/Google) + cache.  |
| `generate.mjs`           | Pipeline principal → écrit `concerts-data.js`.              |
| `seed-overrides.mjs`     | Amorçage d'`overrides.json` depuis les données existantes.   |
| `overrides.json`         | Traductions manuelles prioritaires (clé = ID WordPress).    |
| `translation-cache.json` | Cache des traductions automatiques (versionné).             |
