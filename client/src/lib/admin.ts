import { supabaseAnonKey, supabaseUrl } from "@/const";

const sessionKey = "rassemble-admin-session";

type Session = {
  access_token: string;
  refresh_token?: string;
  user?: { email?: string };
};

export type AdminRegistration = {
  id: number;
  created_at: string;
  nom: string;
  prenom: string;
  adresse: string;
  tel: string;
  participation: "oui" | "non";
};

export function getAdminSession(): Session | null {
  try {
    const value = localStorage.getItem(sessionKey);
    return value ? (JSON.parse(value) as Session) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(sessionKey);
}

export async function signInAdmin(email: string, password: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as Session & { error_description?: string; msg?: string };
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.msg || "Identifiants administrateur incorrects.");
  }

  localStorage.setItem(sessionKey, JSON.stringify(data));
  return data;
}

export async function getRegistrations(): Promise<AdminRegistration[]> {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("Session administrateur absente.");

  const response = await fetch(
    `${supabaseUrl}/rest/v1/registrations?select=id,created_at,nom,prenom,adresse,tel,participation&order=created_at.desc`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }

  if (!response.ok) throw new Error("Impossible de charger les inscriptions.");
  return (await response.json()) as AdminRegistration[];
}
