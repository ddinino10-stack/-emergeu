import { useState } from 'react';
import { supabase } from './supabase';

function Signup({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, type }
      }
    });
    if (error) setError(error.message);
    else setSuccess(true);
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
          <h2 style={{ color: 'white', margin: 0 }}>Create your account</h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Join EmergeU today</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ color: '#FF6B00', marginBottom: '8px' }}>Account created!</h3>
            <p style={{ color: '#888' }}>Check your email to verify your account then sign in 👊🏼</p>
            <button onClick={onSwitch} style={{
              marginTop: '20px', padding: '14px 30px', borderRadius: '12px',
              border: 'none', backgroundColor: '#FF6B00', color: 'white',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}>Go to Sign In</button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)',
                borderRadius: '8px', padding: '12px', marginBottom: '16px',
                color: '#ff6b6b', fontSize: '14px', textAlign: 'center'
              }}>{error}</div>
            )}

            <input
              type="text" placeholder="Full name" value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white',
                fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box'
              }}
            />
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
              type="password" placeholder="Create password" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white',
                fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setType('client')} style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: `2px solid ${type === 'client' ? '#FF6B00' : '#333'}`,
                backgroundColor: type === 'client' ? 'rgba(255,107,0,0.1)' : 'transparent',
                color: type === 'client' ? '#FF6B00' : '#888',
                cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
              }}>👤 I want a PT</button>
              <button onClick={() => setType('pt')} style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: `2px solid ${type === 'pt' ? '#FF6B00' : '#333'}`,
                backgroundColor: type === 'pt' ? 'rgba(255,107,0,0.1)' : 'transparent',
                color: type === 'pt' ? '#FF6B00' : '#888',
                cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
              }}>💪 I am a PT</button>
            </div>

            <button
              onClick={handleSignup} disabled={loading}
              style={{
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '18px',
                fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, marginBottom: '16px'
              }}>
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
            <p style={{ textAlign: 'center', color: '#888', margin: 0 }}>
              Already have an account?{' '}
              <span onClick={onSwitch} style={{ color: '#FF6B00', cursor: 'pointer', fontWeight: 'bold' }}>
                Sign In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;