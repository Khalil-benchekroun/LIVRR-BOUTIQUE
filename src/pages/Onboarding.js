import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Informations', 'Boutique', 'Documents', 'Confirmation'];
const CATEGORIES = ['Vêtements', 'Chaussures', 'Accessoires', 'Beauté', 'Bijoux', 'Lifestyle', 'Sport'];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    name: '', address: '', city: 'Paris', zip: '', description: '',
    categories: [],
    openMon: '10:00 - 19:00', openSat: '10:00 - 20:00', openSun: '',
    siret: '', iban: '',
  });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const toggleCat = cat => setForm(p => ({
    ...p,
    categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat]
  }));

  const handleFinish = async () => {
    setLoading(true);
    await register(form);
    navigate('/');
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--noir)', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ width: '420px', flexShrink: 0, padding: '60px 48px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--white)', letterSpacing: '0.15em', marginBottom: '4px' }}>LIVRR</div>
        <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '48px' }}>Espace Boutique</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--white)', fontWeight: '300', lineHeight: '1.2', marginBottom: '16px' }}>
          Rejoignez le réseau LIVRR
        </h1>
        <p style={{ color: 'rgba(250,249,246,0.5)', fontSize: '15px', lineHeight: '1.7', marginBottom: '48px' }}>
          Vendez vos produits en livraison express à vos clients. Sans entrepôt, directement depuis votre boutique.
        </p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: i < step ? 'var(--success)' : i === step ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '500',
                color: i <= step ? 'var(--noir)' : 'rgba(255,255,255,0.3)',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '14px', color: i === step ? 'var(--white)' : i < step ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)', fontWeight: i === step ? '500' : '400' }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(201,169,110,0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,110,0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '500', marginBottom: '8px' }}>✦ Avantages partenaires</div>
          {['0% de commission les 3 premiers mois', 'Dashboard analytics en temps réel', 'Support dédié 7j/7', 'Livraison assurée en moins d\'1h'].map(a => (
            <div key={a} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>— {a}</div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 80px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          {/* Progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '4px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--gold)', height: '4px', borderRadius: '4px', width: `${progress}%`, transition: '0.4s ease' }} />
          </div>

          {/* Step 0 — Informations personnelles */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--white)', fontWeight: '300', marginBottom: '8px' }}>Vos informations</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Le responsable de la boutique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[['firstName', 'Prénom'], ['lastName', 'Nom']].map(([k, l]) => (
                    <div key={k}>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                      <input className="input-field" value={form[k]} onChange={set(k)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }} />
                    </div>
                  ))}
                </div>
                {[['email', 'Email', 'email'], ['phone', 'Téléphone', 'tel'], ['password', 'Mot de passe', 'password']].map(([k, l, t]) => (
                  <div key={k}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                    <input className="input-field" type={t} value={form[k]} onChange={set(k)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Infos boutique */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--white)', fontWeight: '300', marginBottom: '8px' }}>Votre boutique</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Dites-nous tout sur votre boutique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[['name', 'Nom de la boutique'], ['address', 'Adresse'], ['description', 'Description courte']].map(([k, l]) => (
                  <div key={k}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                    {k === 'description'
                      ? <textarea className="input-field" value={form[k]} onChange={set(k)} rows={3} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)', resize: 'none' }} />
                      : <input className="input-field" value={form[k]} onChange={set(k)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }} />
                    }
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Catégories de produits</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => toggleCat(cat)} style={{
                        padding: '7px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        background: form.categories.includes(cat) ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
                        color: form.categories.includes(cat) ? 'var(--noir)' : 'rgba(255,255,255,0.5)',
                        border: form.categories.includes(cat) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        fontWeight: form.categories.includes(cat) ? '500' : '400',
                        transition: 'var(--transition)',
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Horaires d'ouverture</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[['openMon', 'Lun–Ven'], ['openSat', 'Samedi'], ['openSun', 'Dimanche']].map(([k, l]) => (
                      <div key={k} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', width: '70px', flexShrink: 0 }}>{l}</span>
                        <input className="input-field" value={form[k]} onChange={set(k)} placeholder="Ex: 10:00 - 19:00 ou Fermé" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)', fontSize: '13px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Documents */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--white)', fontWeight: '300', marginBottom: '8px' }}>Documents légaux</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Pour valider votre partenariat et recevoir vos paiements</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[['siret', 'Numéro SIRET', '123 456 789 00012'], ['iban', 'IBAN pour les versements', 'FR76 XXXX XXXX XXXX XXXX XXXX XXX']].map(([k, l, ph]) => (
                  <div key={k}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                    <input className="input-field" value={form[k]} onChange={set(k)} placeholder={ph} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }} />
                  </div>
                ))}
                <div style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '500', marginBottom: '6px' }}>🔒 Sécurité des données</div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>Vos données bancaires sont chiffrées et sécurisées. LIVRR ne stocke jamais vos informations en clair. Les versements sont effectués sous 7 jours ouvrés.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '28px' }}>📄</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Glissez votre Kbis ou cliquez pour uploader</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>PDF, JPG — max 5MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Confirmation */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--white)', fontWeight: '300', marginBottom: '12px' }}>Vous êtes prêt !</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
                Votre dossier sera examiné par l'équipe LIVRR sous 24h. En attendant, découvrez votre espace boutique.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '32px' }}>
                {[
                  ['📧', 'Email de confirmation envoyé à ' + (form.email || 'votre adresse')],
                  ['⏳', 'Validation sous 24h par l\'équipe LIVRR'],
                  ['🚀', 'Accès complet dès validation'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                    <span style={{ fontSize: '20px' }}>{icon}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: '14px 24px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                ← Retour
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn-gold" style={{ flex: 1, padding: '14px', fontSize: '15px' }} onClick={() => setStep(s => s + 1)}>
                Continuer →
              </button>
            ) : (
              <button className="btn-gold" style={{ flex: 1, padding: '14px', fontSize: '15px' }} onClick={handleFinish} disabled={loading}>
                {loading ? 'Création du compte…' : 'Accéder à mon espace →'}
              </button>
            )}
          </div>

          {step === 0 && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
              Déjà partenaire ? <Link to="/login" style={{ color: 'var(--gold)' }}>Se connecter</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
