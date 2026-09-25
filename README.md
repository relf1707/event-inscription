# Rassemble — site d'inscription événementielle

Site responsive en français pour une rencontre d’église, permettant aux membres et invités de transmettre leur **nom, prénom, adresse, téléphone** et de choisir entre **« Je vais participer »** et **« Je ne vais pas participer »**.

## Fonctionnement

- Interface publique responsive, adaptée au mobile.
- Validation des champs obligatoires.
- Écran de confirmation après l'envoi.
- Enregistrement dans Supabase via l'API REST.
- Table `public.registrations` sécurisée par Row Level Security : les visiteurs peuvent créer une réponse, mais ne peuvent pas lire les inscriptions.
- Workflow GitHub Actions inclus dans `.github/workflows/deploy.yml`.

## Personnaliser l'événement

Modifiez `client/src/const.ts` pour changer le nom de marque, la date, l'horaire, le lieu et les textes de présentation.

## Lancer en local

```bash
pnpm install
pnpm dev
```

## Base de données

Le projet Supabase `rassemble-event` est configuré. Le script reproductible est dans `supabase/schema.sql`.

Pour un autre projet, remplacez `configuredSupabaseUrl` et `configuredSupabaseKey` dans `client/src/const.ts`, ou fournissez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` pendant le build.

## Déployer sur GitHub Pages

Le dépôt GitHub est configuré avec une GitHub Action. Dans le dépôt :

1. Ouvrez **Settings → Pages**.
2. Choisissez **GitHub Actions** comme source de publication.
3. La prochaine modification poussée sur `main` lancera le workflow `.github/workflows/deploy.yml`.

Le workflow construit `dist/public` et le publie sur GitHub Pages. Les informations pratiques, le nom et la charte graphique peuvent être modifiés avant le partage du lien public.

## Espace administrateur privé

La page privée est disponible à l'adresse `/admin`. Elle utilise **Supabase Auth** avec email et mot de passe : aucune inscription publique n'est ouverte depuis le site.

Pour créer ton accès, ouvre Supabase puis **Authentication → Users → Add user**, saisis ton adresse email et un mot de passe, puis utilise ces identifiants sur `/admin`. La table autorise l'insertion publique des réponses, mais la lecture est réservée aux utilisateurs Supabase authentifiés grâce à RLS.

Depuis l'espace admin, tu peux rechercher une personne, voir les présents et les absents, te déconnecter et exporter la liste en CSV.
