/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const ADMIN_ID = '9406cb25-1185-4629-b1e8-f4cad9dcaa75';

function AdminDashboard({ user, onExit }) {
  const [activeTab, setActiveTab] = useState('pts');
  const [ptApplications, setPtApplications] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.id === ADMIN_ID;

  useEffect(() => {
    if (isAdmin) fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: pts } = await supabase.from('pt_profiles').select('*');
    const { data: wl } = await supabase.from('waiting_list').select('*');
    setPtApplications(pts || []);
    setWaitingList(wl || []);
    setLoading(false);
  };

  const approvePT = async (userId) => {
    await supabase.from('pt_profiles').update({ approved: true }).eq('user_id', userId);
    fetchData();
  };

  const rejectPT = async (userId) => {
    await supabase.from('pt_profiles').delete().eq('user_id', userId);
    fetchData();
  };

  if (!isAdmin) return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#FF6B00' }}>Access Denied 🔐</h2>
    </div>
  );

  const tabStyle = (tab) => ({
    padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '15px', border: 'none',
    borderBottom: `3px solid ${activeTab === tab ? '#FF6B00' : 'transparent'}`,
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#FF6B00' : '#888'
  });

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* Header */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222', backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU" style={{ height: '50px', borderRadius: '8px' }} />
          <div>
            <h3 style={{ color: '#FF6B00', margin: 0 }}>Admin Dashboard</h3>
            <p style={{ color: '#555', margin: 0, fontSize: '12px' }}>EmergeU Control Centre</p>
          </div>
        </div>
        <button onClick={onExit} style={{
          backgroundColor: 'transparent', color: '#888', border: '1px solid #333',
          padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Exit Admin</button>
      </nav>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '20px', padding: '30px 40px', borderBottom: '1px solid #222', flexWrap: 'wrap' }}>
        {[
          { label: 'PT Applications', value: ptApplications.filter(p => !p.approved).length, icon: '📋' },
          { label: 'Approved PTs', value: ptApplications.filter(p => p.approved).length, icon: '✅' },
          { label: 'Waiting List', value: waitingList.length, icon: '👥' },
          { label: 'Clients', value: waitingList.filter(w => w.type === 'client').length, icon: '🧑' },
          { label: 'PT Signups', value: waitingList.filter(w => w.type === 'pt').length, icon: '💪' },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: '#111', border: '1px solid #222',
            borderRadius: '12px', padding: '20px 30px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B00' }}>{stat.value}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222', padding: '0 40px' }}>
        <button style={tabStyle('pts')} onClick={() => setActiveTab('pts')}>
          PT Applications{' '}
          {ptApplications.filter(p => !p.approved).length > 0 &&
            <span style={{
              backgroundColor: '#FF6B00', color: 'white', borderRadius: '10px',
              padding: '2px 8px', fontSize: '12px', marginLeft: '8px'
            }}>{ptApplications.filter(p => !p.approved).length}</span>
          }
        </button>
        <button style={tabStyle('approved')} onClick={() => setActiveTab('approved')}>Approved PTs</button>
        <button style={tabStyle('waiting')} onClick={() => setActiveTab('waiting')}>Waiting List</button>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 40px' }}>
        {loading ? <p style={{ color: '#888' }}>Loading data...</p> : (
          <>
            {/* PT Applications */}
            {activeTab === 'pts' && (
              <div>
                <h2 style={{ marginBottom: '24px' }}>
                  Pending PT Applications
                  <span style={{ color: '#888', fontSize: '16px', fontWeight: 'normal', marginLeft: '12px' }}>
                    {ptApplications.filter(p => !p.approved).length} pending
                  </span>
                </h2>
                {ptApplications.filter(p => !p.approved).length === 0 ? (
                  <p style={{ color: '#555' }}>No pending applications 🎉</p>
                ) : (
                  ptApplications.filter(p => !p.approved).map((pt, i) => (
                    <div key={i} style={{
                      backgroundColor: '#111', border: '1px solid #222',
                      borderRadius: '16px', padding: '24px', marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#FF6B00', margin: '0 0 8px 0', fontSize: '20px' }}>{pt.name}</h3>
                          <p style={{ color: '#888', margin: '0 0 12px 0', lineHeight: '1.6' }}>{pt.bio}</p>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>📍 {pt.location}</span>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>💻 {pt.training_type}</span>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>💰 {pt.pricing_tier}</span>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>🎯 {pt.coaching_style}</span>
                          </div>
                          {pt.specialisms && (
                            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {pt.specialisms.split(', ').map((s, j) => (
                                <span key={j} style={{
                                  backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid #FF6B00',
                                  color: '#FF6B00', padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
                                }}>{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => approvePT(pt.user_id)} style={{
                            backgroundColor: '#FF6B00', color: 'white', border: 'none',
                            padding: '12px 24px', borderRadius: '25px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '15px'
                          }}>✅ Approve</button>
                          <button onClick={() => rejectPT(pt.user_id)} style={{
                            backgroundColor: 'transparent', color: '#ff4444',
                            border: '2px solid #ff4444', padding: '12px 24px',
                            borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px'
                          }}>❌ Reject</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Approved PTs */}
            {activeTab === 'approved' && (
              <div>
                <h2 style={{ marginBottom: '24px' }}>Approved PTs</h2>
                {ptApplications.filter(p => p.approved).length === 0 ? (
                  <p style={{ color: '#555' }}>No approved PTs yet</p>
                ) : (
                  ptApplications.filter(p => p.approved).map((pt, i) => (
                    <div key={i} style={{
                      backgroundColor: '#111', border: '1px solid #222',
                      borderRadius: '16px', padding: '24px', marginBottom: '16px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ color: '#FF6B00', margin: '0 0 4px 0' }}>{pt.name}</h3>
                        <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>{pt.location} • {pt.training_type}</p>
                        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>{pt.specialisms}</p>
                      </div>
                      <span style={{
                        backgroundColor: 'rgba(0,255,0,0.1)', border: '1px solid #00ff00',
                        color: '#00ff00', padding: '6px 16px', borderRadius: '20px', fontSize: '13px'
                      }}>✅ Live</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Waiting List */}
            {activeTab === 'waiting' && (
              <div>
                <h2 style={{ marginBottom: '24px' }}>Waiting List — {waitingList.length} signups</h2>
                {waitingList.length === 0 ? (
                  <p style={{ color: '#555' }}>No waiting list signups yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <th style={{ textAlign: 'left', padding: '12px', color: '#888', fontWeight: 'normal' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: '#888', fontWeight: 'normal' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: '#888', fontWeight: 'normal' }}>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitingList.map((person, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                          <td style={{ padding: '14px 12px', color: 'white' }}>{person.name}</td>
                          <td style={{ padding: '14px 12px', color: '#888' }}>{person.email}</td>
                          <td style={{ padding: '14px 12px' }}>
                            <span style={{
                              backgroundColor: person.type === 'pt' ? 'rgba(255,107,0,0.1)' : 'rgba(0,100,255,0.1)',
                              border: `1px solid ${person.type === 'pt' ? '#FF6B00' : '#0064ff'}`,
                              color: person.type === 'pt' ? '#FF6B00' : '#4488ff',
                              padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
                            }}>{person.type === 'pt' ? '💪 PT' : '👤 Client'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;