import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Church, Download, LogOut, Search, ShieldCheck, Users, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { eventConfig } from "@/const";
import { clearAdminSession, getAdminSession, getRegistrations, signInAdmin, type AdminRegistration } from "@/lib/admin";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInAdmin(email.trim(), password);
      navigate("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-shell">
      <div className="admin-login-glow" />
      <div className="admin-login-card">
        <Link href="/" className="admin-back-link"><ArrowLeft size={15} /> Retour au site public</Link>
        <div className="admin-emblem"><Church size={27} strokeWidth={1.5} /></div>
        <div className="admin-login-kicker">ESPACE DE SERVICE</div>
        <h1>Bienvenue dans<br /><em>l'espace de l'église.</em></h1>
        <p>Connectez-vous pour consulter les réponses reçues pour votre rencontre.</p>
        <form onSubmit={submit} className="admin-login-form">
          <label>Email administrateur<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@eglise.fr" autoComplete="email" required /></label>
          <label>Mot de passe<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" required /></label>
          {error ? <div className="admin-error" role="alert">{error}</div> : null}
          <button className="admin-primary-button" type="submit" disabled={loading}>{loading ? "Connexion…" : "Accéder aux inscriptions"}</button>
        </form>
        <div className="admin-secure-note"><ShieldCheck size={16} /> Accès sécurisé par Supabase Auth</div>
      </div>
    </main>
  );
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState(getAdminSession());
  const [rows, setRows] = useState<AdminRegistration[]>([]);
  const [loading, setLoading] = useState(Boolean(session));
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session) return;
    getRegistrations().then(setRows).catch((reason) => {
      setError(reason instanceof Error ? reason.message : "Erreur de chargement.");
      if (!getAdminSession()) setSession(null);
    }).finally(() => setLoading(false));
  }, [session]);

  const visibleRows = useMemo(() => {
    const term = search.toLocaleLowerCase().trim();
    if (!term) return rows;
    return rows.filter((row) => `${row.prenom} ${row.nom} ${row.adresse} ${row.tel}`.toLocaleLowerCase().includes(term));
  }, [rows, search]);

  const attending = rows.filter((row) => row.participation === "oui").length;
  const notAttending = rows.filter((row) => row.participation === "non").length;

  const logout = () => {
    clearAdminSession();
    setSession(null);
    navigate("/admin");
  };

  const exportCsv = () => {
    const header = ["Prénom", "Nom", "Adresse", "Téléphone", "Participation", "Date"].join(";");
    const lines = rows.map((row) => [row.prenom, row.nom, row.adresse, row.tel, row.participation === "oui" ? "Participe" : "Ne participe pas", formatDate(row.created_at)].map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"));
    const blob = new Blob(["\ufeff" + [header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inscriptions-eglise.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!session) return <AdminLogin />;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand"><span className="admin-brand-mark"><Church size={18} /></span><span>{eventConfig.brand}</span></Link>
        <div className="admin-side-label">ESPACE PRIVÉ</div>
        <div className="admin-side-nav"><div className="admin-side-active"><Users size={17} /> Inscriptions</div><Link href="/"><ArrowLeft size={17} /> Retour au site</Link></div>
        <div className="admin-sidebar-quote"><span>“</span><p>Servir avec joie,<br />accueillir avec amour.</p></div>
        <button className="admin-logout" type="button" onClick={logout}><LogOut size={16} /> Déconnexion</button>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div><div className="admin-breadcrumb">TABLEAU DE BORD <span>/</span> INSCRIPTIONS</div><h1>Les personnes inscrites</h1><p>Suivez les réponses de la communauté pour votre prochaine rencontre.</p></div><div className="admin-top-date"><CalendarDays size={16} />{eventConfig.date}</div></header>
        <div className="admin-content">
          <div className="admin-stats"><div className="admin-stat-card admin-stat-total"><div className="admin-stat-icon"><Users size={20} /></div><span>Total des réponses</span><strong>{rows.length}</strong><small>réponses reçues</small></div><div className="admin-stat-card"><div className="admin-stat-icon admin-stat-green"><CheckCircle2 size={20} /></div><span>Présents</span><strong>{attending}</strong><small>participeront</small></div><div className="admin-stat-card"><div className="admin-stat-icon admin-stat-sand"><XCircle size={20} /></div><span>Absents</span><strong>{notAttending}</strong><small>ne participeront pas</small></div></div>
          <div className="admin-table-header"><div><h2>Réponses récentes</h2><span>{visibleRows.length} personne{visibleRows.length > 1 ? "s" : ""} affichée{visibleRows.length > 1 ? "s" : ""}</span></div><div className="admin-actions"><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une personne…" /></label><button className="admin-export" type="button" onClick={exportCsv}><Download size={15} /> Exporter CSV</button></div></div>
          {error ? <div className="admin-error admin-error-wide" role="alert">{error}</div> : null}
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Personne</th><th>Coordonnées</th><th>Participation</th><th>Réponse reçue</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="admin-empty">Chargement des inscriptions…</td></tr> : visibleRows.length === 0 ? <tr><td colSpan={4} className="admin-empty">Aucune inscription à afficher.</td></tr> : visibleRows.map((row) => <tr key={row.id}><td><div className="admin-person"><span>{row.prenom.charAt(0)}{row.nom.charAt(0)}</span><div><strong>{row.prenom} {row.nom}</strong><small>{row.adresse}</small></div></div></td><td><div className="admin-contact"><span>{row.tel}</span><small>{row.adresse}</small></div></td><td><span className={`admin-badge ${row.participation === "oui" ? "admin-badge-yes" : "admin-badge-no"}`}>{row.participation === "oui" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{row.participation === "oui" ? "Participe" : "Ne participe pas"}</span></td><td><span className="admin-date">{formatDate(row.created_at)}</span></td></tr>)}</tbody></table></div>
        </div>
      </section>
    </main>
  );
}
