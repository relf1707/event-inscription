export const eventConfig = {
  brand: "Rassemble",
  eyebrow: "RENDEZ-VOUS 2026",
  title: "On se retrouve bientôt.",
  description:
    "Confirmez votre présence en quelques secondes. Votre réponse nous aide à préparer une expérience qui vous ressemble.",
  date: "Date à confirmer",
  time: "Horaire à confirmer",
  location: "Lieu à confirmer",
  eventNote: "Les informations pratiques seront communiquées prochainement.",
};

export const participationOptions = [
  {
    value: "oui",
    title: "Je vais participer",
    description: "Je souhaite être présent(e) à l'événement.",
  },
  {
    value: "non",
    title: "Je ne vais pas participer",
    description: "Je ne pourrai malheureusement pas être présent(e).",
  },
] as const;

export type Participation = (typeof participationOptions)[number]["value"];

export type Registration = {
  nom: string;
  prenom: string;
  adresse: string;
  tel: string;
  participation: Participation;
};

export const requiredFields: Array<keyof Registration> = [
  "nom",
  "prenom",
  "adresse",
  "tel",
  "participation",
];

export const storageKey = "rassemble-registration-submissions";

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
