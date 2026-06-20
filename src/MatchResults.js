/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function MatchResults({ user, onBack, onMessage }) {
  const [pts, setPts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPT, setSelectedPT] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pt_profiles')
      .select('*')
      .eq('approved', true)
      .limit(3);
    if (!error) setPts(data || []);
    setLoading(false);
  };

  if (loading) return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🤖</div>
        <p style={{ color: '#FF6B00', fontSize: '20px', fontWeight: 'bold' }}>Finding your perfect matches...</p>
      </div>
    </div>
  );

  if (selectedPT) return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
          style={{ height: '50px', borderRadius: '8px' }} />
        <button onClick={() => setSelectedPT(null)} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>← Back to Matches</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: '#111', border: '1px solid #333',
          borderRadius: '24px', padding: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              backgroundColor: '#FF6B00', overflow: 'hidden',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '40px', margin: '0 auto 16px'
            }}>
              {selectedPT.photo_url
                ? <img src={selectedPT.photo_url} alt={selectedPT.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '💪'}
            </div>
            <h2 style={{ color: '#FF6B00', margin: '0 0 8px 0', fontSize: '28px' }}>{selectedPT.name}</h2>
            <p style={{ color: '#888', margin: 0 }}>📍 {selectedPT.location}</p>
          </div>

          <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '24px', fontSize: '16px' }}>
            {selectedPT.bio}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {[
              { label: 'Training', value: selectedPT.training_type },
              { label: 'Pricing', value: selectedPT.pricing_tier + '/mo' },
              { label: 'Style', value: selectedPT.coaching_style },
              { label: 'Availability', value: selectedPT.availability },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: '#1a1a1a', border: '1px solid #222',
                borderRadius: '12px', padding: '12px 16px', flex: 1, minWidth: '120px'
              }}>
                <p style={{ color: '#555', fontSize: '12px', margin: '0 0 4px 0' }}>{item.label}</p>
                <p style={{ color: 'white', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {selectedPT.specialisms && (
            <div style={{ marginBottom: '30px' }}>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>Specialisms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedPT.specialisms.split(', ').map((s, j) => (
                  <span key={j} style={{
                    backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid #FF6B00',
                    color: '#FF6B00', padding: '6px 14px', borderRadius: '20px', fontSize: '13px'
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1, padding: '16px', borderRadius: '12px', border: 'none',
              backgroundColor: '#FF6B00', color: 'white', fontSize: '18px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              Choose {selectedPT.name.split(' ')[0]} as My PT 🔥
            </button>
            {onMessage && (
              <button onClick={() => onMessage({ id: selectedPT.user_id, name: selectedPT.name })} style={{
                padding: '16px 24px', borderRadius: '12px',
                border: '2px solid #FF6B00', backgroundColor: 'transparent',
                color: '#FF6B00', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
              }}>💬 Message</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
          style={{ height: '50px', borderRadius: '8px' }} />
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
            Your Perfect <span style={{ color: '#FF6B00' }}>Matches</span>
          </h1>
          <p style={{ color: '#888', fontSize: '18px' }}>
            Based on your goals and personality, we found these PTs for you
          </p>
        </div>

        {pts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>😔</div>
            <h2 style={{ color: '#FF6B00', marginBottom: '16px' }}>No matches yet</h2>
            <p style={{ color: '#888' }}>
              We're still building our PT network. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pts.map((pt, i) => (
              <div key={i} style={{
                backgroundColor: '#111',
                border: `1px solid ${i === 0 ? '#FF6B00' : '#222'}`,
                borderRadius: '20px', padding: '30px',
                position: 'relative', overflow: 'hidden'
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    backgroundColor: '#FF6B00', color: 'white',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 'bold'
                  }}>⭐ Best Match</div>
                )}

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '70px', height: '70px', borderRadius: '50%',
                    backgroundColor: '#FF6B00', overflow: 'hidden',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '30px', flexShrink: 0
                  }}>
                    {pt.photo_url
                      ? <img src={pt.photo_url} alt={pt.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '💪'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#FF6B00', margin: '0 0 6px 0', fontSize: '22px' }}>{pt.name}</h3>
                    <p style={{ color: '#888', margin: '0 0 12px 0', fontSize: '14px' }}>
                      📍 {pt.location} • 💻 {pt.training_type} • 💰 {pt.pricing_tier}/mo
                    </p>
                    <p style={{ color: '#ccc', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                      {pt.bio?.substring(0, 150)}...
                    </p>

                    {pt.specialisms && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {pt.specialisms.split(', ').slice(0, 4).map((s, j) => (
                          <span key={j} style={{
                            backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid #FF6B00',
                            color: '#FF6B00', padding: '4px 10px', borderRadius: '15px', fontSize: '12px'
                          }}>{s}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedPT(pt)}
                        style={{
                          backgroundColor: i === 0 ? '#FF6B00' : 'transparent',
                          color: 'white', border: `2px solid #FF6B00`,
                          padding: '12px 24px', borderRadius: '25px', cursor: 'pointer',
                          fontWeight: 'bold', fontSize: '15px'
                        }}>
                        View Full Profile
                      </button>
                      {onMessage && (
                        <button
                          onClick={() => onMessage({ id: pt.user_id, name: pt.name })}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#FF6B00', border: '2px solid #FF6B00',
                            padding: '12px 24px', borderRadius: '25px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '15px'
                          }}>
                          💬 Message
                        </button>
                      )}
                      <button style={{
                        backgroundColor: 'transparent', color: '#888',
                        border: '1px solid #333', padding: '12px 24px',
                        borderRadius: '25px', cursor: 'pointer', fontSize: '15px'
                      }}>
                        Not for me
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchResults;
