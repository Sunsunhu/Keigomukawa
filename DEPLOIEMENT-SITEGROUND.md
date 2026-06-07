# Déploiement sur SiteGround — Keigo Mukawa

Site **statique** : tout le contenu à publier se trouve dans le dossier **`public/`**.
Sur SiteGround, ces fichiers vont dans **`public_html`** (racine web).

---

## 1. Prérequis (SiteGround)

1. Connectez-vous à [SiteGround](https://my.siteground.com/) → **Websites** → votre site.
2. Ouvrez **Site Tools** (panneau de gestion).
3. Notez les identifiants **FTP** (ou utilisez le **File Manager**) :
   - **Site Tools → Devs → FTP Accounts** (ou **File Manager** directement).

Le domaine acheté chez SiteGround est en général **déjà relié** au hosting.
Sinon : **Domain → Point to Website** et choisissez ce site.

---

## 2. Activer HTTPS (SSL)

1. **Site Tools → Security → SSL Manager**
2. Installez un certificat **Let’s Encrypt** pour votre domaine (gratuit).
3. Activez **Enforce HTTPS** si proposé.

Sans SSL, le site fonctionne en `http://` mais les navigateurs afficheront « Non sécurisé ».

---

## 3. Envoyer les fichiers du site

### Option A — File Manager (le plus simple)

1. **Site Tools → Devs → File Manager**
2. Ouvrez le dossier **`public_html`**
3. **Supprimez** le contenu par défaut de SiteGround (`default.html`, etc.) si présent.
4. Sur votre Mac, ouvrez le dossier du projet :
   ```
   Keigo Mukawa Site Officiel/public/
   ```
5. **Uploadez tout le contenu** de `public/` **dans** `public_html` :
   - `index.html`, `404.html`, `.htaccess`
   - dossiers `css/`, `fr/`, `en/`, `images/`, `js/`, `files/`
6. Ne créez **pas** de sous-dossier `public` sur le serveur : les fichiers doivent être **directement** dans `public_html`.

Structure attendue sur le serveur :

```
public_html/
├── .htaccess
├── index.html
├── 404.html
├── css/
├── fr/
├── en/
├── images/
├── js/
└── files/
```

### Option B — FTP / SFTP (FileZilla, Cyberduck…)

| Paramètre   | Valeur (typique SiteGround)      |
|------------|-----------------------------------|
| Hôte       | Voir **FTP Accounts** dans Site Tools |
| Port       | **21** (FTP) ou **22** (SFTP)     |
| Utilisateur / mot de passe | Compte FTP créé dans Site Tools |
| Dossier distant | **`public_html`**            |

Uploadez le **contenu** de `public/` (pas le dossier `public` lui-même).

---

## 4. Tester le site

Remplacez `VOTRE-DOMAINE.com` par votre domaine :

- `https://VOTRE-DOMAINE.com/` → redirige vers `/fr/`
- `https://VOTRE-DOMAINE.com/fr/`
- `https://VOTRE-DOMAINE.com/fr/concerts.html`
- `https://VOTRE-DOMAINE.com/en/`

Si une page renvoie **404**, vérifiez que le fichier existe bien dans `public_html` au bon chemin.

---

## 5. Mises à jour du site

Quand vous modifiez le site en local (ou après une synchro automatique des concerts) :

1. Regénérez si besoin : `npm run concerts:sync`
2. Re-uploadez **uniquement les fichiers modifiés** (ou tout `public/` pour être sûr).

Les concerts peuvent aussi être mis à jour via GitHub Actions → vous re-uploadez ensuite `public/js/concerts-data.js`.

---

## 6. Domaine acheté ailleurs (optionnel)

Si le **domaine** n’est **pas** chez SiteGround :

1. Chez le registrar du domaine, modifiez les **nameservers** vers ceux indiqués par SiteGround
   (**Site Tools → Domain → Nameservers**), **ou**
2. Créez un enregistrement **A** pointant vers l’**IP** du serveur SiteGround
   (**Site Tools → Domain → DNS Zone Editor**).

Attendre la propagation DNS : de quelques minutes à 48 h.

---

## 7. Vercel vs SiteGround

| | Vercel (actuel) | SiteGround |
|---|----------------|------------|
| Déploiement | `git push` automatique | Upload FTP / File Manager |
| SSL | Automatique | Let’s Encrypt dans Site Tools |
| Redirections `/fr`, `/en` | `vercel.json` | `.htaccess` (déjà dans `public/`) |

Vous pouvez garder **les deux** temporairement (test SiteGround avant de couper Vercel),
ou ne garder que SiteGround une fois satisfait.

---

## 8. Dépannage

| Problème | Piste |
|----------|--------|
| Page blanche / 403 | Vérifiez les permissions des fichiers (644) et dossiers (755) dans File Manager. |
| CSS / images cassés | Les chemins commencent par `/css/`, `/images/` : le site doit être à la **racine** du domaine, pas dans un sous-dossier. |
| `/fr` sans slash ne marche pas | Vérifiez que **`.htaccess`** est bien uploadé dans `public_html`. |
| Ancienne page SiteGround | Supprimez `default.html` / `index.php` par défaut dans `public_html`. |

---

## Commande locale (prévisualisation avant upload)

```bash
cd "/Users/sunsunhu/Keigo Mukawa Site Officiel"
npm start
# → http://localhost:3000/fr/
```
