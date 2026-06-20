/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function SessionBooking({ user, onBack, onMessage }) {
  const [bookings, setBookings] = useState([]);
  const [pts, setPts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    pt_id: '',
    date: '',
    time: '',
    session_type: '',
    notes: ''
  });

  const sessionTypes = ['Personal Training', 'Nutrition Consultation', 'Online Session', 'Assessment', 'HIIT Session', 'Strength Training'];
  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  useEffect(() => {
    fetchBookings();
    fetchPTs();
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', user.id)
      .order('date', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  };

  const fetchPTs = async () => {
    const { data } = await supabase
      .from('pt_profiles')
      .select('user_id, name')
      .eq('approved', true);
    setPts(data || []);
  };

  const handleBook = async () => {
    if (!form.pt_id || !form.date || !form.time || !form.session_type) return;
    setSubmitting(true);
    const pt = pts.find(p => p.user_id === form.pt_id);
    const { error } = await supabase.from('bookings').insert([{
      client_id: user.id,
      pt_id: form.pt_id,
      client_name: user.user_metadata?.name || 'Client',
      pt_name: pt?.name || 'PT',
      date: form.date,
      time: form.time,
      session_type: form.session_type,
      notes: form.notes,
      status: 'pending'
    }]);
    if (!error) {
      setBooked(true);
      fetchBookings();
      setTimeout(() => {
        setBooked(false);
        setShowForm(false);
        setForm({ pt_id: '', date: '', time: '', session_type: '', notes: '' });
      }, 2000);
    }
    setSubmitting(false);
  };

  const cancelBooking = async (id) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    fetchBookings();
  };

  const getStatusColour = (status) => {
    if (status === 'confirmed') return '#00cc44';
    if (status === 'pending') return '#FFA500';
    if (status === 'cancelled') return '#ff4444';
    return '#888';
  };

  const upcoming = bookings.filter(b => b.status !== 'cancelled' && new Date(b.date) >= new Date());
  const past = bookings.filter(b => b.status !== 'cancelled' && new Date(b.date) < new Date());

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    border: '1px solid #333', backgroundColor: '#1a1a1a',
    color: 'white', fontSize: '16px', marginBottom: '16px',
    boxSizing: 'border-box', outline: 'none'
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222', backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU" style={{ height: '50px', borderRadius: '8px' }} />
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888', border: '1px solid #333',
          padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              My <span style={{ color: '#FF6B00' }}>Sessions</span>
            </h1>
            <p style={{ color: '#888', marginTop: '8px' }}>Book and manage your PT sessions</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            backgroundColor: '#FF6B00', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '25px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '15px'
          }}>+ Book Session</button>
        </div>

        {showForm && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #333',
            borderRadius: '20px', padding: '30px', marginBottom: '30px'
          }}>
            <h3 style={{ color: '#FF6B00', marginBottom: '24px' }}>Book a New Session</h3>

            {booked && (
              <div style={{
                backgroundColor: 'rgba(0,255,0,0.08)', border: '1px solid #00cc44',
                borderRadius: '12px', padding: '14px', textAlign: 'center',
                marginBottom: '16px', color: '#00cc44', fontWeight: 'bold'
              }}>✅ Session request sent!</div>
            )}

            <label style={{ color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Select PT *</label>
            <select value={form.pt_id} onChange={e => setForm({ ...form, pt_id: e.target.value })} style={inputStyle}>
              <option value="">Choose your PT...</option>
              {pts.map((pt, i) => <option key={i} value={pt.user_id}>{pt.name}</option>)}
            </select>

            <label style={{ color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Date *</label>
            <input
              type="date" value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={inputStyle}
            />

            <label style={{ color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Time *</label>
            <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle}>
              <option value="">Choose a time...</option>
              {timeSlots.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>

            <label style={{ color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Session Type *</label>
            <select value={form.session_type} onChange={e => setForm({ ...form, session_type: e.target.value })} style={inputStyle}>
              <option value="">Choose session type...</option>
              {sessionTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>

            <label style={{ color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Notes (optional)</label>
            <textarea
              placeholder="Any specific goals or notes for your PT..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Arial' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleBook} disabled={submitting} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '16px',
                fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}>{submitting ? 'Sending...' : 'Send Booking Request 🚀'}</button>
              <button onClick={() => setShowForm(false)} style={{
                padding: '14px 20px', borderRadius: '12px',
                border: '1px solid #333', backgroundColor: 'transparent',
                color: '#888', cursor: 'pointer', fontSize: '16px'
              }}>Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Loading sessions...</p>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#ccc' }}>Upcoming Sessions</h2>
            {upcoming.length === 0 ? (
              <div style={{
                backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px',
                padding: '30px', textAlign: 'center', marginBottom: '30px'
              }}>
                <p style={{ color: '#555', margin: 0 }}>No upcoming sessions — book one above! 💪</p>
              </div>
            ) : (
              upcoming.map((b, i) => (
                <div key={i} style={{
                  backgroundColor: '#111', border: '1px solid #222',
                  borderRadius: '16px', padding: '24px', marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ color: '#FF6B00', margin: '0 0 8px 0' }}>{b.session_type}</h3>
                      <p style={{ color: '#ccc', margin: '0 0 4px 0' }}>👤 {b.pt_name}</p>
                      <p style={{ color: '#888', margin: '0 0 4px 0' }}>📅 {new Date(b.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {b.time}</p>
                      {b.notes && <p style={{ color: '#555', margin: '8px 0 0 0', fontSize: '13px' }}>📝 {b.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        backgroundColor: `rgba(${b.status === 'confirmed' ? '0,204,68' : '255,165,0'},0.1)`,
                        border: `1px solid ${getStatusColour(b.status)}`,
                        color: getStatusColour(b.status),
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                      }}>{b.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {onMessage && (
                          <button onClick={() => onMessage({ id: b.pt_id, name: b.pt_name })} style={{
                            backgroundColor: 'transparent', color: '#FF6B00',
                            border: '1px solid #FF6B00', padding: '6px 14px',
                            borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
                          }}>💬 Message</button>
                        )}
                        {b.status === 'pending' && (
                          <button onClick={() => cancelBooking(b.id)} style={{
                            backgroundColor: 'transparent', color: '#ff4444',
                            border: '1px solid #ff4444', padding: '6px 14px',
                            borderRadius: '20px', cursor: 'pointer', fontSize: '12px'
                          }}>Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {past.length > 0 && (
              <>
                <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#ccc', marginTop: '30px' }}>Past Sessions</h2>
                {past.map((b, i) => (
                  <div key={i} style={{
                    backgroundColor: '#111', border: '1px solid #1a1a1a',
                    borderRadius: '16px', padding: '24px', marginBottom: '16px', opacity: 0.6
                  }}>
                    <h3 style={{ color: '#888', margin: '0 0 8px 0' }}>{b.session_type}</h3>
                    <p style={{ color: '#666', margin: '0 0 4px 0' }}>👤 {b.pt_name}</p>
                    <p style={{ color: '#555', margin: 0 }}>📅 {new Date(b.date).toLocaleDateString('en-GB')} at {b.time}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SessionBooking;
