import {
  isSupabaseConfigured,
  storageKey,
  supabaseAnonKey,
  supabaseUrl,
  type Registration,
} from "@/const";

export async function saveRegistration(registration: Registration) {
  if (isSupabaseConfigured) {
    const response = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        nom: registration.nom,
        prenom: registration.prenom,
        adresse: registration.adresse,
        tel: registration.tel,
        participation: registration.participation,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Impossible d'enregistrer cette réponse.");
    }

    return { mode: "supabase" as const };
  }

  const existing = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as Array<
    Registration & { createdAt: string }
  >;
  existing.push({ ...registration, createdAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(existing));

  return { mode: "local" as const };
}
