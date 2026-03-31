import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    navigate('/');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--noir)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--white)', letterSpacing: '0.15em', marginBottom: '4px' }}>LIVRR</div>
          <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Espace Boutique</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-xl)', padding: '40px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--white)', fontWeight: '300', marginBottom: '28px' }}>Connexion</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[['email', 'Email', 'email', email, setEmail], ['password', 'Mot de passe', 'password', password, setPassword]].map(([k, l, t, v, sv]) => (
              <div key={k}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                <input className="input-field" type={t} value={v} onChange={e => sv(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }} required />
              </div>
            ))}
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
            Pas encore partenaire ? <Link to="/inscription" style={{ color: 'var(--gold)' }}>Rejoindre LIVRR</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '24px' }}>
          💡 Mode démo : entrez n'importe quel email/mot de passe
        </p>
      </div>
    </div>
  );
}
