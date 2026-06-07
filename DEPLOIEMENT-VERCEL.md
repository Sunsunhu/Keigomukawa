# Déploiement GitHub + Vercel — Keigo Mukawa

Site statique : le dossier **`public/`** est publié tel quel (comme sur Netlify).

## 1. Créer le dépôt GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Nom suggéré : `keigo-mukawa-site` (privé ou public)
3. **Ne cochez pas** « Add a README » (le projet existe déjà en local)

Dans le Terminal, à la racine du projet :

```bash
cd "/Users/sunsunhu/Keigo Mukawa Site Officiel"
git init
git add .
git commit -m "Site officiel Keigo Mukawa — déploiement Vercel"
git branch -M main
git remote add origin https://github.com/Sunsunhu/Keigomukawa.git
git push -u origin main
```

> Dépôt : **https://github.com/Sunsunhu/Keigomukawa** — tant que la page GitHub affiche « empty », Vercel ne pourra pas déployer. Il faut d’abord réussir le `git push`.

## 2. Connecter Vercel

1. [vercel.com](https://vercel.com) → **Add New…** → **Project**
2. **Import** le dépôt GitHub créé à l’étape 1
3. Paramètres détectés automatiquement via `vercel.json` :
   - **Root Directory** : `.` (racine du dépôt)
   - **Output Directory** : `public`
   - **Build Command** : vide
4. **Deploy**

Chaque `git push` sur `main` redéploie le site. Chaque **Pull Request** reçoit une **URL de prévisualisation** automatique (Preview Deployment).

## 3. URLs à tester

- `https://VOTRE-PROJET.vercel.app/fr/`
- `https://VOTRE-PROJET.vercel.app/fr/biographie.html`
- `https://VOTRE-PROJET.vercel.app/en/`

## 4. Domaine personnalisé (optionnel)

Vercel → Project → **Settings** → **Domains** → ajouter `keigomukawa.com` (ou autre) et suivre les instructions DNS.

## 5. Développement local

```bash
npm start
# → http://localhost:3000
```

Prévisualisation style Vercel (optionnel) :

```bash
npx vercel
```

## Notes

- **Source unique** : modifiez uniquement `public/`. Le dossier `NETLIFY-DEPLOY/` n’est plus nécessaire pour Vercel (ignoré par Git).
- Les redirections `/fr` → `/fr/` et `/en` → `/en/` sont dans `vercel.json` (équivalent à `_redirects` Netlify).
