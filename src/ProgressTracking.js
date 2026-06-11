/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function ProgressTracking({ user, onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    notes: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setLogs(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.date) return;
    setSubmitting(true);
    const { error } = await supabase.from('progress_logs').insert([{
      user_id: user.id,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      chest: form.chest ? parseFloat(form.chest) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      hips: form.hips ? parseFloat(form.hips) : null,
      arms: form.arms ? parseFloat(form.arms) : null,
      notes: form.notes || null
    }]);
    if (!error) {
      setSaved(true);
      fetchLogs();
      setTimeout(() => {
        setSaved(false);
        setShowForm(false);
        setForm({ date: new Date().toISOString().split('T')[0], weight: '', chest: '', waist: '', hips: '', arms: '', notes: '' });
      }, 2000);
    }
    setSubmitting(false);
  };

  const deleteLog = async (id) => {
    await supabase.from('progress_logs').delete().eq('id', id);
    fetchLogs();
  };

  // Stats calculations
  const weightLogs = logs.filter(l => l.weight);
  const latestWeight = weightLogs[0]?.weight;
  const firstWeight = weightLogs[weightLogs.length - 1]?.weight;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;
  const latestWaist = logs.find(l => l.waist)?.waist;
  const firstWaist = [...logs].reverse().find(l => l.waist)?.waist;
  const waistChange = latestWaist && firstWaist ? (latestWaist - firstWaist).toFixed(1) : null;

  // Simple weight chart
  const chartWeights = weightLogs.slice(0, 8).reverse();
  const minW = chartWeights.length ? Math.min(...chartWeights.map(l => l.weight)) - 2 : 0;
  const maxW = chartWeights.length ? Math.max(...chartWeights.map(l => l.weight)) + 2 : 100;
  const chartH = 120;
  const chartW = 300;

  const getY = (w) => chartH - ((w - minW) / (maxW - minW)) * chartH;
  const getX = (i) => chartWeights.length > 1 ? (i / (chartWeights.length - 1)) * chartW : chartW / 2;

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid #333', backgroundColor: '#1a1a1a',
    color: 'white', fontSize: '15px', marginBottom: '12px',
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

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              My <span style={{ color: '#FF6B00' }}>Progress</span>
            </h1>
            <p style={{ color: '#888', marginTop: '8px' }}>Track your transformation journey</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            backgroundColor: '#FF6B00', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '25px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '15px'
          }}>+ Log Progress</button>
        </div>

        {/* Stats Cards */}
        {logs.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {[
              {
                label: 'Current Weight',
                value: latestWeight ? `${latestWeight} kg` : '—',
                sub: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg total` : 'First entry',
                colour: weightChange < 0 ? '#00cc44' : weightChange > 0 ? '#ff4444' : '#FF6B00'
              },
              {
                label: 'Entries Logged',
                value: logs.length,
                sub: `Over ${Math.ceil((new Date() - new Date(logs[logs.length - 1]?.date)) / (1000 * 60 * 60 * 24 * 7))} weeks`,
                colour: '#FF6B00'
              },
              {
                label: 'Waist',
                value: latestWaist ? `${latestWaist} cm` : '—',
                sub: waistChange ? `${waistChange > 0 ? '+' : ''}${waistChange} cm total` : 'Not tracked yet',
                colour: waistChange < 0 ? '#00cc44' : '#888'
              }
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: '#111', border: '1px solid #222',
                borderRadius: '12px', padding: '20px', flex: 1, minWidth: '140px'
              }}>
                <p style={{ color: '#555', fontSize: '12px', margin: '0 0 8px 0' }}>{stat.label}</p>
                <p style={{ color: stat.colour, fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{stat.value}</p>
                <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Weight Chart */}
        {chartWeights.length > 1 && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #222',
            borderRadius: '16px', padding: '24px', marginBottom: '30px'
          }}>
            <h3 style={{ color: '#ccc', marginBottom: '16px', fontSize: '16px' }}>Weight Trend</h3>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i}
                  x1={0} y1={t * chartH}
                  x2={chartW} y2={t * chartH}
                  stroke="#222" strokeWidth="1"
                />
              ))}
              {/* Line */}
              <polyline
                points={chartWeights.map((l, i) => `${getX(i)},${getY(l.weight)}`).join(' ')}
                fill="none" stroke="#FF6B00" strokeWidth="2.5"
              />
              {/* Dots */}
              {chartWeights.map((l, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(l.weight)} r="5" fill="#FF6B00" />
                  <text x={getX(i)} y={getY(l.weight) - 10} textAnchor="middle" fill="#ccc" fontSize="11">
                    {l.weight}
                  </text>
                </g>
              ))}
              {/* Date labels */}
              {chartWeights.map((l, i) => (
                <text key={i} x={getX(i)} y={chartH + 16} textAnchor="middle" fill="#555" fontSize="10">
                  {new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </text>
              ))}
            </svg>
          </div>
        )}

        {/* Log Form */}
        {showForm && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #333',
            borderRadius: '20px', padding: '30px', marginBottom: '30px'
          }}>
            <h3 style={{ color: '#FF6B00', marginBottom: '24px' }}>Log Today's Progress</h3>

            {saved && (
              <div style={{
                backgroundColor: 'rgba(0,255,0,0.08)', border: '1px solid #00cc44',
                borderRadius: '12px', padding: '14px', textAlign: 'center',
                marginBottom: '16px', color: '#00cc44', fontWeight: 'bold'
              }}>✅ Progress logged!</div>
            )}

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={inputStyle} />

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Weight (kg)</label>
            <input type="number" step="0.1" placeholder="e.g. 82.5"
              value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
              style={inputStyle} />

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Measurements (cm) — optional</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['chest', 'waist', 'hips', 'arms'].map(field => (
                <div key={field} style={{ flex: 1, minWidth: '100px' }}>
                  <input type="number" step="0.1" placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{ ...inputStyle, marginBottom: '0' }} />
                </div>
              ))}
            </div>

            <label style={{ color: '#888', fontSize: '13px', margin: '12px 0 6px 0', display: 'block' }}>Notes (optional)</label>
            <textarea placeholder="How are you feeling? Any wins this week?"
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Arial' }} />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={handleSave} disabled={submitting} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '16px',
                fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}>{submitting ? 'Saving...' : 'Save Progress 💪'}</button>
              <button onClick={() => setShowForm(false)} style={{
                padding: '14px 20px', borderRadius: '12px', border: '1px solid #333',
                backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontSize: '16px'
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* History */}
        {loading ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Loading progress...</p>
        ) : logs.length === 0 ? (
          <div style={{
            backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px',
            padding: '50px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>📊</div>
            <p style={{ color: '#555', margin: 0 }}>No progress logged yet — hit the button above to start! 💪</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', color: '#ccc', marginBottom: '16px' }}>History</h2>
            {logs.map((log, i) => {
              const prev = logs[i + 1];
              const wDiff = log.weight && prev?.weight ? (log.weight - prev.weight).toFixed(1) : null;
              return (
                <div key={i} style={{
                  backgroundColor: '#111', border: '1px solid #222',
                  borderRadius: '16px', padding: '20px', marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <p style={{ color: '#FF6B00', fontWeight: 'bold', margin: 0 }}>
                          📅 {new Date(log.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {wDiff !== null && (
                          <span style={{
                            color: wDiff < 0 ? '#00cc44' : wDiff > 0 ? '#ff4444' : '#888',
                            fontSize: '13px', fontWeight: 'bold'
                          }}>{wDiff > 0 ? '▲' : wDiff < 0 ? '▼' : '—'} {Math.abs(wDiff)} kg</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {log.weight && <span style={{ color: '#ccc', fontSize: '14px' }}>⚖️ {log.weight} kg</span>}
                        {log.chest && <span style={{ color: '#888', fontSize: '14px' }}>Chest: {log.chest}cm</span>}
                        {log.waist && <span style={{ color: '#888', fontSize: '14px' }}>Waist: {log.waist}cm</span>}
                        {log.hips && <span style={{ color: '#888', fontSize: '14px' }}>Hips: {log.hips}cm</span>}
                        {log.arms && <span style={{ color: '#888', fontSize: '14px' }}>Arms: {log.arms}cm</span>}
                      </div>
                      {log.notes && <p style={{ color: '#555', fontSize: '13px', margin: '8px 0 0 0' }}>📝 {log.notes}</p>}
                    </div>
                    <button onClick={() => deleteLog(log.id)} style={{
                      backgroundColor: 'transparent', color: '#333',
                      border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px'
                    }}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default ProgressTracking;
