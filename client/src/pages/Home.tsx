import { useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  eventConfig,
  isSupabaseConfigured,
  participationOptions,
  type Participation,
  type Registration,
} from "@/const";
import { saveRegistration } from "@/lib/supabase";

const initialForm: Registration = {
  nom: "",
  prenom: "",
  adresse: "",
  tel: "",
  participation: "oui",
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: keyof Registration;
  value: string;
  onChange: (name: keyof Registration, value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div className="field-group">
      <label htmlFor={name} className="field-label">
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`field-input ${error ? "field-input-error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function AppMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<Registration>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Registration, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const updateField = (name: keyof Registration, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof Registration, string>> = {};
    if (!form.nom.trim()) nextErrors.nom = "Indiquez votre nom.";
    if (!form.prenom.trim()) nextErrors.prenom = "Indiquez votre prénom.";
    if (!form.adresse.trim()) nextErrors.adresse = "Indiquez votre adresse.";
    if (!form.tel.trim()) nextErrors.tel = "Indiquez votre numéro de téléphone.";
    if (!form.participation) nextErrors.participation = "Choisissez une réponse.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await saveRegistration({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        adresse: form.adresse.trim(),
        tel: form.tel.trim(),
        participation: form.participation,
      });
      setSubmitted(true);
      setForm(initialForm);
      window.setTimeout(() => {
        document.getElementById("confirmation")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 40);
    } catch {
      setSubmitError("Votre réponse n'a pas pu être enregistrée. Vérifiez votre connexion puis réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setSubmitError("");
    window.setTimeout(() => document.getElementById("inscription")?.scrollIntoView({ behavior: "smooth" }), 40);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="Retour à l'accueil">
          <AppMark />
          <span>{eventConfig.brand}</span>
        </a>
        <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Navigation principale">
          <a href="#evenement" onClick={() => setMenuOpen(false)}>L'événement</a>
          <a href="#inscription" onClick={() => setMenuOpen(false)}>Inscription</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>Questions</a>
        </nav>
        <a className="header-cta" href="#inscription">
          S'inscrire <ArrowRight size={16} strokeWidth={2.5} />
        </a>
        <button className="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>
        <section id="accueil" className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-orb hero-orb-one" aria-hidden="true" />
          <div className="hero-orb hero-orb-two" aria-hidden="true" />
          <div className="hero-content">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />{eventConfig.eyebrow}</div>
            <h1>{eventConfig.title}</h1>
            <p className="hero-description">{eventConfig.description}</p>
            <div className="hero-actions">
              <a className="button button-accent" href="#inscription">Je confirme ma présence <ArrowRight size={18} /></a>
              <a className="text-link text-link-light" href="#evenement">Découvrir l'événement <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="hero-note" aria-label="Note événementielle">
            <Sparkles size={17} />
            <span>{eventConfig.eventNote}</span>
          </div>
          <div className="hero-side-label" aria-hidden="true">01 <span /> 03</div>
        </section>

        <section id="evenement" className="event-details section-pad">
          <div className="section-kicker">LE RENDEZ-VOUS</div>
          <div className="details-heading">
            <h2>Les détails,<br /><em>en un coup d'œil.</em></h2>
            <p>Pour nous permettre de vous accueillir dans les meilleures conditions, prenez un instant pour nous transmettre votre réponse.</p>
          </div>
          <div className="detail-cards">
            <div className="detail-card detail-card-featured">
              <div className="detail-icon"><CalendarDays size={21} /></div>
              <div><span>Date</span><strong>{eventConfig.date}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-icon"><Clock3 size={21} /></div>
              <div><span>Horaire</span><strong>{eventConfig.time}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-icon"><MapPin size={21} /></div>
              <div><span>Lieu</span><strong>{eventConfig.location}</strong></div>
            </div>
          </div>
        </section>

        <section id="inscription" className="registration-section section-pad">
          <div className="registration-layout">
            <div className="registration-intro">
              <div className="section-kicker section-kicker-dark">VOTRE RÉPONSE</div>
              <h2>Un oui, un non —<br /><em>l'essentiel est de répondre.</em></h2>
              <p>Merci de compléter les informations ci-contre. Cela ne vous prendra qu'une minute.</p>
              <div className="privacy-note"><ShieldCheck size={18} /><span>Vos informations restent confidentielles et sont uniquement utilisées pour l'organisation de l'événement.</span></div>
              <div className="mini-stat"><div className="mini-stat-icons"><span>V</span><span>M</span><span>A</span><span>+</span></div><div><strong>Merci pour votre réponse</strong><span>Chaque confirmation compte.</span></div></div>
            </div>

            <div className="form-card">
              {!submitted ? (
                <form onSubmit={submit} noValidate>
                  <div className="form-card-header"><span>01 / 02</span><strong>Vos coordonnées</strong></div>
                  <div className="form-fields-row">
                    <Field label="Nom" name="nom" value={form.nom} onChange={updateField} placeholder="Dupont" autoComplete="family-name" error={errors.nom} />
                    <Field label="Prénom" name="prenom" value={form.prenom} onChange={updateField} placeholder="Marie" autoComplete="given-name" error={errors.prenom} />
                  </div>
                  <Field label="Adresse" name="adresse" value={form.adresse} onChange={updateField} placeholder="12 rue des Lilas, 75000 Paris" autoComplete="street-address" error={errors.adresse} />
                  <Field label="Téléphone" name="tel" value={form.tel} onChange={updateField} placeholder="06 00 00 00 00" type="tel" autoComplete="tel" error={errors.tel} />
                  <div className="form-divider" />
                  <div className="form-card-header choice-header"><span>02 / 02</span><strong>Votre participation</strong></div>
                  <fieldset className="choice-list">
                    <legend className="sr-only">Choisissez votre participation</legend>
                    {participationOptions.map((option) => {
                      const selected = form.participation === option.value;
                      return (
                        <label key={option.value} className={`choice-card ${selected ? "choice-card-selected" : ""}`}>
                          <input type="radio" name="participation" value={option.value} checked={selected} onChange={(event) => updateField("participation", event.target.value as Participation)} />
                          <span className="choice-radio">{selected ? <Check size={14} strokeWidth={3} /> : null}</span>
                          <span className="choice-copy"><strong>{option.title}</strong><small>{option.description}</small></span>
                          <ChevronRight className="choice-arrow" size={18} />
                        </label>
                      );
                    })}
                  </fieldset>
                  {errors.participation ? <p className="field-error choice-error">{errors.participation}</p> : null}
                  {submitError ? <div className="submit-error" role="alert">{submitError}</div> : null}
                  <button className="button button-dark form-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enregistrement…" : "Envoyer ma réponse"}
                    {!isSubmitting ? <ArrowRight size={18} /> : null}
                  </button>
                  <p className="required-note">* Champs obligatoires</p>
                </form>
              ) : (
                <div id="confirmation" className="confirmation-panel" role="status">
                  <div className="confirmation-icon"><CheckCircle2 size={38} strokeWidth={1.7} /></div>
                  <div className="section-kicker">RÉPONSE ENREGISTRÉE</div>
                  <h3>Merci, c'est noté.</h3>
                  <p>Votre réponse a bien été prise en compte. Nous vous tiendrons informé(e) des prochaines informations.</p>
                  <button className="text-link text-link-dark" type="button" onClick={resetForm}>Modifier ma réponse <ArrowRight size={16} /></button>
                </div>
              )}
            </div>
          </div>
          {!isSupabaseConfigured ? <div className="demo-notice"><span className="demo-pulse" />Mode aperçu : connectez Supabase pour enregistrer les réponses en ligne.</div> : null}
        </section>

        <section id="faq" className="faq-section section-pad">
          <div className="faq-heading"><div className="section-kicker">BESOIN D'AIDE ?</div><h2>Les questions<br /><em>que vous vous posez.</em></h2></div>
          <div className="faq-list">
            <details><summary>Comment modifier ma réponse ? <span>+</span></summary><p>Vous pouvez nous contacter directement pour nous signaler un changement de participation.</p></details>
            <details><summary>Que deviennent mes informations ? <span>+</span></summary><p>Elles sont utilisées uniquement pour gérer les inscriptions et les communications liées à cet événement.</p></details>
            <details><summary>Je peux inscrire plusieurs personnes ? <span>+</span></summary><p>Remplissez le formulaire pour chaque personne afin que chaque réponse soit correctement enregistrée.</p></details>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="brand footer-brand"><AppMark /><span>{eventConfig.brand}</span></div><span>Un événement, une histoire à partager.</span><a href="#accueil">Retour en haut <ArrowRight size={15} /></a></footer>
    </div>
  );
}
