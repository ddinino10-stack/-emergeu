/* eslint-disable */
import { useState, useEffect } from 'react';
 
function CookieBanner() {
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);
 
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
 
  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };
 
  if (!visible) return null;
 
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: '#111', borderTop: '1px solid #222',
      padding: '16px 24px', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '16px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
    }}>
      <div style={{ flex: 1, minWidth: '250px' }}>
        <p style={{ color: '#ccc', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          🍪 We use cookies to improve your experience on EmergeU. By continuing to use this site you accept our{' '}
          <span style={{ color: '#FF6B00' }}>Privacy Policy</span>
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            backgroundColor: 'transparent', color: '#888',
            border: '1px solid #333', padding: '10px 20px',
            borderRadius: '20px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold'
          }}>
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: '#FF6B00', color: 'white',
            border: 'none', padding: '10px 20px',
            borderRadius: '20px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold'
          }}>
          Accept
        </button>
      </div>
    </div>
  );
}
 
export default CookieBanner;