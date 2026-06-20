/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const ALL_MEASUREMENTS = [
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'arms', label: 'Arms', unit: 'cm' },
  { key: 'thighs', label: 'Thighs', unit: 'cm' },
];

function ProgressTracking({ user, onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '', waist: '', hips: '', arms: '', thighs: '',
    notes: ''
  });

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setLogs(data || []);
    setLoading(false);
  };

  const toggleMeasurement = (key) => {
    setSelectedMeasurements(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
    if (selectedMeasurements.includes(key)) {
      setForm(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSave = async () => {
    if (!form.date) return;
    setSubmitting(true);
    const entry = {
      user_id: user.id,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      chest: form.chest ? parseFloat(form.chest) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      hips: form.hips ? parseFloat(form.hips) : null,
      arms: form.arms ? parseFloat(form.arms) : null,
      thighs: form.thighs ? parseFloat(form.thighs) : null,
      notes: form.notes || null
    };
    const { error } = await supabase.from('progress_logs').insert([entry]);
    if (!error) {
      setSaved(true);
      fetchLogs();
      setTimeout(() => {
        setSaved(false);
        setShowForm(false);
        setSelectedMeasurements([]);
        setForm({ date: new Date().toISOString().split('T')[0], weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', notes: '' });
      }, 2000);
    }
    setSubmitting(false);
  };

  const deleteLog = async (id) => {
    await supabase.from('progress_logs').delete().eq('id', id);
    fetchLogs();
  };

  // Stats
  const weightLogs = logs.filter(l => l.weight);
  const latestWeight = weightLogs[0]?.weight;
  const firstWeight = weightLogs[weightLogs.length - 1]?.weight;
  const weightChange = latestWeight && firstWeight && latestWeight !== firstWeight
    ? (latestWeight - firstWeight).toFixed(1) : null;

  // Weight chart
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
    color: 'white', fontSize: '15px', marginBottom: '0',
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
            <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', flex: 1, minWidth: '140px' }}>
              <p style={{ color: '#555', fontSize: '12px', margin: '0 0 8px 0' }}>Current Weight</p>
              <p style={{ color: '#FF6B00', fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {latestWeight ? `${latestWeight} kg` : '—'}
              </p>
              <p style={{ color: weightChange < 0 ? '#00cc44' : weightChange > 0 ? '#ff4444' : '#555', fontSize: '12px', margin: 0 }}>
                {weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg overall` : 'First entry'}
              </p>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', flex: 1, minWidth: '140px' }}>
              <p style={{ color: '#555', fontSize: '12px', margin: '0 0 8px 0' }}>Entries Logged</p>
              <p style={{ color: '#FF6B00', fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{logs.length}</p>
              <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>Keep it up 💪</p>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', flex: 1, minWidth: '140px' }}>
              <p style={{ color: '#555', fontSize: '12px', margin: '0 0 8px 0' }}>Tracking Since</p>
              <p style={{ color: '#FF6B00', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {new Date(logs[logs.length - 1]?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
              <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>
                {Math.ceil((new Date() - new Date(logs[logs.length - 1]?.date)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        )}

        {/* Weight Chart */}
        {chartWeights.length > 1 && (
          <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '30px' }}>
            <h3 style={{ color: '#ccc', marginBottom: '16px', fontSize: '16px' }}>Weight Trend</h3>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: 'visible' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={0} y1={t * chartH} x2={chartW} y2={t * chartH} stroke="#222" strokeWidth="1" />
              ))}
              <polyline
                points={chartWeights.map((l, i) => `${getX(i)},${getY(l.weight)}`).join(' ')}
                fill="none" stroke="#FF6B00" strokeWidth="2.5"
              />
              {chartWeights.map((l, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(l.weight)} r="5" fill="#FF6B00" />
                  <text x={getX(i)} y={getY(l.weight) - 10} textAnchor="middle" fill="#ccc" fontSize="11">{l.weight}</text>
                  <text x={getX(i)} y={chartH + 16} textAnchor="middle" fill="#555" fontSize="10">
                    {new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Log Form */}
        {showForm && (
          <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
            <h3 style={{ color: '#FF6B00', marginBottom: '24px' }}>Log Progress</h3>

            {saved && (
              <div style={{ backgroundColor: 'rgba(0,255,0,0.08)', border: '1px solid #00cc44', borderRadius: '12px', padding: '14px', textAlign: 'center', marginBottom: '16px', color: '#00cc44', fontWeight: 'bold' }}>
                ✅ Progress logged!
              </div>
            )}

            {/* Date */}
            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={{ ...inputStyle, marginBottom: '16px' }} />

            {/* Weight */}
            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
              Weight (kg) <span style={{ color: '#555' }}>— optional</span>
            </label>
            <input type="number" step="0.1" placeholder="e.g. 82.5"
              value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
              style={{ ...inputStyle, marginBottom: '20px' }} />

            {/* Measurement toggles */}
            <label style={{ color: '#888', fontSize: '13px', marginBottom: '12px', display: 'block' }}>
              Add measurements <span style={{ color: '#555' }}>— tap to include</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {ALL_MEASUREMENTS.map(m => (
                <button key={m.key} onClick={() => toggleMeasurement(m.key)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${selectedMeasurements.includes(m.key) ? '#FF6B00' : '#333'}`,
                  backgroundColor: selectedMeasurements.includes(m.key) ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: selectedMeasurements.includes(m.key) ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold'
                }}>{m.label}</button>
              ))}
            </div>

            {/* Selected measurement inputs */}
            {selectedMeasurements.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {ALL_MEASUREMENTS.filter(m => selectedMeasurements.includes(m.key)).map(m => (
                  <div key={m.key} style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ color: '#888', fontSize: '12px', marginBottom: '6px', display: 'block' }}>{m.label} ({m.unit})</label>
                    <input type="number" step="0.1" placeholder="0.0"
                      value={form[m.key]} onChange={e => setForm({ ...form, [m.key]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block', marginTop: selectedMeasurements.length > 0 ? '8px' : '0' }}>
              Notes <span style={{ color: '#555' }}>— optional</span>
            </label>
            <textarea placeholder="How are you feeling? Any wins this week?"
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Arial', marginBottom: '16px', width: '100%' }} />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSave} disabled={submitting} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '16px',
                fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}>{submitting ? 'Saving...' : 'Save Progress 💪'}</button>
              <button onClick={() => { setShowForm(false); setSelectedMeasurements([]); }} style={{
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
          <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px', padding: '50px', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>📊</div>
            <p style={{ color: '#555', margin: 0 }}>No progress logged yet — hit the button above to start! 💪</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', color: '#ccc', marginBottom: '16px' }}>History</h2>
            {logs.map((log, i) => {
              const prev = logs[i + 1];
              const wDiff = log.weight && prev?.weight ? (log.weight - prev.weight).toFixed(1) : null;
              const hasMeasurements = ['chest', 'waist', 'hips', 'arms', 'thighs'].some(k => log[k]);
              return (
                <div key={i} style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px', padding: '20px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <p style={{ color: '#FF6B00', fontWeight: 'bold', margin: 0 }}>
                          📅 {new Date(log.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {wDiff !== null && (
                          <span style={{ color: wDiff < 0 ? '#00cc44' : wDiff > 0 ? '#ff4444' : '#888', fontSize: '13px', fontWeight: 'bold' }}>
                            {wDiff > 0 ? '▲' : wDiff < 0 ? '▼' : '—'} {Math.abs(wDiff)} kg
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {log.weight && <span style={{ color: '#ccc', fontSize: '14px' }}>⚖️ {log.weight} kg</span>}
                        {hasMeasurements && ALL_MEASUREMENTS.filter(m => log[m.key]).map(m => (
                          <span key={m.key} style={{ color: '#888', fontSize: '14px' }}>{m.label}: {log[m.key]}{m.unit}</span>
                        ))}
                      </div>
                      {log.notes && <p style={{ color: '#555', fontSize: '13px', margin: '8px 0 0 0' }}>📝 {log.notes}</p>}
                    </div>
                    <button onClick={() => deleteLog(log.id)} style={{
                      backgroundColor: 'transparent', color: '#333', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px'
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