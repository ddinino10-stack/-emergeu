import { useState } from 'react';
import { supabase } from './supabase';

function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#111', border: '1px solid #333', borderRadius: '24px',
        padding: '40px', width: '100%', maxWidth: '440px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src={process.env.PUBLIC_URL + '/logo.jpg'}
            alt="EmergeU"
            style={{ height: '80px', borderRadius: '12px', marginBottom: '16px' }}
          />
          <h2 style={{ color: 'white', margin: 0 }}>Welcome back</h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Sign in to EmergeU</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            color: '#ff6b6b', fontSize: '14px', textAlign: 'center'
          }}>{error}</div>
        )}

        <input
          type="email" placeholder="Email address" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white',
            fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box'
          }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white',
            fontSize: '16px', marginBottom: '24px', boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleLogin} disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            backgroundColor: '#FF6B00', color: 'white', fontSize: '18px',
            fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: '16px'
          }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ textAlign: 'center', color: '#888', margin: 0 }}>
          Don't have an account?{' '}
          <span
            onClick={onSwitch}
            style={{ color: '#FF6B00', cursor: 'pointer', fontWeight: 'bold' }}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;