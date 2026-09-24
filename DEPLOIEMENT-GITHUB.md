# Déployer le site sur GitHub Pages avec Supabase

Le site est conçu pour être hébergé sur **GitHub Pages**. GitHub Pages héberge uniquement les fichiers statiques ; la base de données est donc fournie par **Supabase**.

## 1. Créer la table Supabase

1. Créez un projet gratuit sur [supabase.com](https://supabase.com).
2. Ouvrez **SQL Editor**.
3. Copiez-collez le contenu de `supabase/schema.sql`, puis exécutez-le.
4. Dans **Project Settings > API**, récupérez l'URL du projet et la clé `anon public`.

## 2. Connecter le formulaire

Créez un fichier `.env.local` à la racine du projet à partir de `supabase/configuration-exemple.txt` :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

La clé `anon public` peut être utilisée dans le navigateur si les règles RLS du script SQL sont conservées. **Ne mettez jamais la clé `service_role` dans le site.**

## 3. Publier sur GitHub Pages

Le plus simple est d'utiliser GitHub Actions :

1. Poussez le contenu du projet sur un dépôt GitHub.
2. Dans le dépôt, ouvrez **Settings > Secrets and variables > Actions**.
3. Ajoutez les secrets `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
4. Configurez le workflow GitHub Pages pour lancer `pnpm install --frozen-lockfile`, puis `pnpm build` et publier le dossier `dist`.
5. Dans **Settings > Pages**, choisissez **GitHub Actions** comme source.

Le site contient déjà l'URL et la clé **publishable** de ce projet Supabase dans `client/src/const.ts`, afin que la version GitHub Pages fonctionne immédiatement. Les variables GitHub restent disponibles pour remplacer cette configuration lors d'un futur changement de projet. La clé publishable n'est pas une clé secrète : l'accès est protégé par les règles RLS de la table.

## 4. Personnaliser l'événement

Modifiez les textes, la date, le lieu et le nom de marque dans `client/src/const.ts`. Le formulaire contient déjà les champs **Nom, Prénom, Adresse, Téléphone** et le choix **Je vais participer / Je ne vais pas participer**.
