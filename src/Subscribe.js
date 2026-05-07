/* eslint-disable */
import { useState } from 'react';
import { supabase } from './supabase';

function Subscribe({ user, onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const features = [
    '🥗 Unlimited personalised meal plans',
    '💪 Custom workout programmes',
    '📊 Progress tracking and adjustments',
    '🧠 Advanced nutrition advice',
    '⚡ Priority responses from Santiago',
    '📋 Weekly check-in reports',
    '🎯 Goal setting and accountability',
    '🔥 Cancel anytime'
  ];

  const handleSubscribe = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.REACT_APP_STRIPE_PRICE_ID,
          userId: user.id,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No URL returned:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B00, #ff9500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(255,107,0,0.4)'
          }}>🤖</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            Unlock <span style={{ color: '#FF6B00' }}>Santiago Pro</span>
          </h1>
          <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.6' }}>
            Get unlimited meal plans, workout programmes and personalised coaching from your AI PT
          </p>
        </div>

        {/* Pricing Card */}
        <div style={{
          backgroundColor: '#111', border: '2px solid #FF6B00',
          borderRadius: '24px', padding: '30px', marginBottom: '24px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '16px', right: '16px',
            backgroundColor: '#FF6B00', color: 'white',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 'bold'
          }}>MOST POPULAR</div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#FF6B00' }}>£9.99</span>
              <span style={{ color: '#888', fontSize: '16px' }}>/month</span>
            </div>
            <p style={{ color: '#555', margin: '4px 0 0 0', fontSize: '14px' }}>
              Cancel anytime — no contracts
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            {features.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>✅</span>
                <span style={{ color: '#ccc', fontSize: '15px' }}>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: '100%', padding: '18px', borderRadius: '12px',
              border: 'none', backgroundColor: '#FF6B00', color: 'white',
              fontSize: '18px', fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(255,107,0,0.4)'
            }}>
            {loading ? 'Processing...' : 'Start Santiago Pro 🚀'}
          </button>
        </div>

        {/* Free Plan */}
        <div style={{
          backgroundColor: '#111', border: '1px solid #222',
          borderRadius: '16px', padding: '20px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#888', margin: '0 0 12px 0', fontSize: '16px' }}>
            Free Plan — What you keep:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              '💬 General fitness Q&A',
              '🎯 AI PT matching',
              '👤 PT messaging',
              '📱 Access to platform'
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#888', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onBack} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          border: '1px solid #333', backgroundColor: 'transparent',
          color: '#888', fontSize: '16px', cursor: 'pointer'
        }}>
          Maybe later
        </button>

        <p style={{
          textAlign: 'center', color: '#444', fontSize: '12px',
          marginTop: '20px', lineHeight: '1.6'
        }}>
          🔒 Secure payment powered by Stripe<br />
          By subscribing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

export default Subscribe;