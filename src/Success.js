/* eslint-disable */
import { useEffect } from 'react';
import { supabase } from './supabase';

function Success({ user, onContinue }) {
  useEffect(() => {
    if (user?.id) {
      supabase.from('subscriptions').upsert([{
        user_id: user.id,
        plan: 'santiago_pro',
        status: 'active',
        created_at: new Date().toISOString()
      }]);
    }
  }, []);

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
        <h1 style={{ color: '#FF6B00', fontSize: '36px', marginBottom: '16px' }}>
          Welcome to Santiago Pro!
        </h1>
        <p style={{ color: '#888', fontSize: '18px', lineHeight: '1.8', marginBottom: '40px' }}>
          Your subscription is active 🔥 Santiago is ready to create your personalised meal plans and workout programmes!
        </p>
        <button onClick={onContinue} style={{
          backgroundColor: '#FF6B00', color: 'white', border: 'none',
          padding: '18px 50px', borderRadius: '30px', cursor: 'pointer',
          fontSize: '18px', fontWeight: 'bold'
        }}>
          Start with Santiago 💪🏼
        </button>
      </div>
    </div>
  );
}

export default Success;