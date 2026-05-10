/* eslint-disable */
import { useState } from 'react';

function PTTools({ user, onBack }) {
  const [activeTool, setActiveTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Fitness Plan State
  const [clientName, setClientName] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [clientGoal, setClientGoal] = useState('');
  const [clientLevel, setClientLevel] = useState('');
  const [clientDays, setClientDays] = useState('');
  const [clientInjuries, setClientInjuries] = useState('');
  const [trainingType, setTrainingType] = useState('');

  // Meal Plan State
  const [mealClientName, setMealClientName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealGoal, setMealGoal] = useState('');
  const [mealDietary, setMealDietary] = useState('');
  const [mealAllergies, setMealAllergies] = useState('');
  const [mealPreferences, setMealPreferences] = useState('');

  // Session Notes State
  const [notesClientName, setNotesClientName] = useState('');
  const [rawNotes, setRawNotes] = useState('');

  const callAI = async (prompt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data?.content?.[0]?.text || 'Could not generate response';
  };

  const generateFitnessPlan = async () => {
    if (!clientName || !clientGoal || !clientLevel) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are an expert personal trainer. Create a detailed ${clientDays || 4} day per week fitness programme for a client with these details:

Name: ${clientName}
Age: ${clientAge || 'Not specified'}
Goal: ${clientGoal}
Experience Level: ${clientLevel}
Training Style: ${trainingType || 'Mixed'}
Injuries/Limitations: ${clientInjuries || 'None'}

Create a complete programme with:
- Weekly schedule overview
- Each session with exercises, sets, reps, rest periods
- Progression guidelines for weeks 1-4
- Warm up and cool down recommendations
- Key coaching points for this client

Format it clearly and professionally as if it's a document to hand to the client.`;

      const text = await callAI(prompt);
      setResult({ type: 'fitness', content: text, clientName });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateMealPlan = async () => {
    if (!mealClientName || !mealCalories || !mealGoal) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are an expert nutritionist and personal trainer. Create a detailed 7 day meal plan for a client with these details:

Name: ${mealClientName}
Daily Calorie Target: ${mealCalories} calories
Goal: ${mealGoal}
Dietary Preference: ${mealDietary || 'No restrictions'}
Allergies: ${mealAllergies || 'None'}
Food Preferences: ${mealPreferences || 'No specific preferences'}

Create a complete 7 day meal plan with:
- Daily calorie and macro breakdown (protein, carbs, fat)
- Breakfast, lunch, dinner and snacks for each day
- Portion sizes for each meal
- Simple meal prep tips
- Shopping list for the week
- Key nutrition advice for their goal

Format it clearly and professionally as if it's a document to hand to the client.`;

      const text = await callAI(prompt);
      setResult({ type: 'meal', content: text, clientName: mealClientName });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateSessionNotes = async () => {
    if (!notesClientName || !rawNotes) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are a professional personal trainer. Take these rough session notes and format them into professional, detailed session notes.

Client: ${notesClientName}
Date: ${new Date().toLocaleDateString('en-GB')}
Raw Notes: ${rawNotes}

Format into professional session notes including:
- Session Summary
- Exercises Completed (with sets/reps/weights if mentioned)
- Client Performance Notes
- Observations (form, energy levels, mood)
- Progress Notes
- Action Points for Next Session
- Trainer Recommendations

Make it professional, detailed and appropriate for a client record.`;

      const text = await callAI(prompt);
      setResult({ type: 'notes', content: text, clientName: notesClientName });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid #333', backgroundColor: '#1a1a1a',
    color: 'white', fontSize: '15px', marginBottom: '12px',
    boxSizing: 'border-box', fontFamily: 'Arial'
  };

  const labelStyle = {
    color: '#888', fontSize: '14px', display: 'block', marginBottom: '6px'
  };

  const tools = [
    { id: 'fitness', icon: '💪', title: 'Fitness Plan Generator', desc: 'Create personalised training programmes for clients in seconds' },
    { id: 'meal', icon: '🥗', title: 'Meal Plan Generator', desc: 'Build detailed 7 day nutrition plans tailored to each client' },
    { id: 'notes', icon: '📝', title: 'Session Notes', desc: 'Turn rough notes into professional client session records' }
  ];

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      {/* Header */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 30px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
            style={{ height: '45px', borderRadius: '8px' }} />
          <div>
            <h3 style={{ color: 'white', margin: 0 }}>PT AI Tools</h3>
            <p style={{ color: '#FF6B00', margin: 0, fontSize: '13px' }}>Powered by AI 🤖</p>
          </div>
        </div>
        <button
          onClick={() => { if (activeTool) { setActiveTool(null); setResult(null); } else onBack(); }}
          style={{
            backgroundColor: 'transparent', color: '#888',
            border: '1px solid #333', padding: '8px 16px',
            borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
          }}>
          {activeTool ? '← Back to Tools' : 'Back to Dashboard'}
        </button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Tool Selection */}
        {!activeTool && (
          <div>
            <h2 style={{ marginBottom: '8px' }}>
              PT <span style={{ color: '#FF6B00' }}>AI Tools</span>
            </h2>
            <p style={{ color: '#888', marginBottom: '40px' }}>
              Save hours of admin time with AI powered tools built specifically for personal trainers
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tools.map((tool, i) => (
                <div
                  key={i}
                  onClick={() => setActiveTool(tool.id)}
                  style={{
                    backgroundColor: '#111', border: '1px solid #333',
                    borderRadius: '20px', padding: '24px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#FF6B00'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '16px',
                    backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid #FF6B00',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', flexShrink: 0
                  }}>{tool.icon}</div>
                  <div>
                    <h3 style={{ color: '#FF6B00', margin: '0 0 6px 0' }}>{tool.title}</h3>
                    <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{tool.desc}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#FF6B00', fontSize: '20px' }}>→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FITNESS PLAN TOOL */}
        {activeTool === 'fitness' && !result && (
          <div>
            <h2 style={{ marginBottom: '8px' }}>
              💪 <span style={{ color: '#FF6B00' }}>Fitness Plan</span> Generator
            </h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>Fill in your client's details and AI will create a full programme</p>

            <label style={labelStyle}>Client Name *</label>
            <input type="text" placeholder="e.g. John Smith" value={clientName}
              onChange={e => setClientName(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Client Age</label>
            <input type="number" placeholder="e.g. 32" value={clientAge}
              onChange={e => setClientAge(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Training Goal *</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['Weight Loss', 'Muscle Building', 'General Fitness', 'Strength', 'Endurance', 'Sport Specific'].map((goal, i) => (
                <button key={i} onClick={() => setClientGoal(goal)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${clientGoal === goal ? '#FF6B00' : '#333'}`,
                  backgroundColor: clientGoal === goal ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: clientGoal === goal ? '#FF6B00' : '#888', fontSize: '13px', fontWeight: 'bold'
                }}>{goal}</button>
              ))}
            </div>

            <label style={labelStyle}>Experience Level *</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map((level, i) => (
                <button key={i} onClick={() => setClientLevel(level)} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${clientLevel === level ? '#FF6B00' : '#333'}`,
                  backgroundColor: clientLevel === level ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: clientLevel === level ? '#FF6B00' : '#888', fontSize: '14px', fontWeight: 'bold'
                }}>{level}</button>
              ))}
            </div>

            <label style={labelStyle}>Training Style</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['Weights', 'Cardio', 'HIIT', 'Mixed', 'Home Workout', 'Calisthenics'].map((type, i) => (
                <button key={i} onClick={() => setTrainingType(type)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${trainingType === type ? '#FF6B00' : '#333'}`,
                  backgroundColor: trainingType === type ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: trainingType === type ? '#FF6B00' : '#888', fontSize: '13px', fontWeight: 'bold'
                }}>{type}</button>
              ))}
            </div>

            <label style={labelStyle}>Days per week</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              {['2', '3', '4', '5', '6'].map((day, i) => (
                <button key={i} onClick={() => setClientDays(day)} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${clientDays === day ? '#FF6B00' : '#333'}`,
                  backgroundColor: clientDays === day ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: clientDays === day ? '#FF6B00' : '#888', fontSize: '14px', fontWeight: 'bold'
                }}>{day}</button>
              ))}
            </div>

            <label style={labelStyle}>Injuries or Limitations</label>
            <input type="text" placeholder="e.g. Bad knees, lower back pain (or leave blank)"
              value={clientInjuries} onChange={e => setClientInjuries(e.target.value)} style={inputStyle} />

            <button
              onClick={generateFitnessPlan}
              disabled={loading || !clientName || !clientGoal || !clientLevel}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '18px', fontWeight: 'bold',
                cursor: loading || !clientName || !clientGoal || !clientLevel ? 'not-allowed' : 'pointer',
                opacity: loading || !clientName || !clientGoal || !clientLevel ? 0.6 : 1
              }}>
              {loading ? '🤖 Generating Programme...' : 'Generate Fitness Plan 💪'}
            </button>
          </div>
        )}

        {/* MEAL PLAN TOOL */}
        {activeTool === 'meal' && !result && (
          <div>
            <h2 style={{ marginBottom: '8px' }}>
              🥗 <span style={{ color: '#FF6B00' }}>Meal Plan</span> Generator
            </h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>Create a personalised 7 day nutrition plan for your client</p>

            <label style={labelStyle}>Client Name *</label>
            <input type="text" placeholder="e.g. Sarah Jones" value={mealClientName}
              onChange={e => setMealClientName(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Daily Calorie Target *</label>
            <input type="number" placeholder="e.g. 1800" value={mealCalories}
              onChange={e => setMealCalories(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Nutrition Goal *</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['Weight Loss', 'Muscle Gain', 'Maintenance', 'Performance', 'Body Recomposition'].map((goal, i) => (
                <button key={i} onClick={() => setMealGoal(goal)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${mealGoal === goal ? '#FF6B00' : '#333'}`,
                  backgroundColor: mealGoal === goal ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: mealGoal === goal ? '#FF6B00' : '#888', fontSize: '13px', fontWeight: 'bold'
                }}>{goal}</button>
              ))}
            </div>

            <label style={labelStyle}>Dietary Preference</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['No Restrictions', 'Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'High Protein'].map((diet, i) => (
                <button key={i} onClick={() => setMealDietary(diet)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${mealDietary === diet ? '#FF6B00' : '#333'}`,
                  backgroundColor: mealDietary === diet ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: mealDietary === diet ? '#FF6B00' : '#888', fontSize: '13px', fontWeight: 'bold'
                }}>{diet}</button>
              ))}
            </div>

            <label style={labelStyle}>Allergies</label>
            <input type="text" placeholder="e.g. Nuts, shellfish (or leave blank)"
              value={mealAllergies} onChange={e => setMealAllergies(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Food Preferences</label>
            <input type="text" placeholder="e.g. Loves chicken and rice, hates fish"
              value={mealPreferences} onChange={e => setMealPreferences(e.target.value)} style={inputStyle} />

            <button
              onClick={generateMealPlan}
              disabled={loading || !mealClientName || !mealCalories || !mealGoal}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '18px', fontWeight: 'bold',
                cursor: loading || !mealClientName || !mealCalories || !mealGoal ? 'not-allowed' : 'pointer',
                opacity: loading || !mealClientName || !mealCalories || !mealGoal ? 0.6 : 1
              }}>
              {loading ? '🤖 Creating Meal Plan...' : 'Generate Meal Plan 🥗'}
            </button>
          </div>
        )}

        {/* SESSION NOTES TOOL */}
        {activeTool === 'notes' && !result && (
          <div>
            <h2 style={{ marginBottom: '8px' }}>
              📝 <span style={{ color: '#FF6B00' }}>Session Notes</span>
            </h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>
              Type your rough notes and AI will format them into professional session records
            </p>

            <label style={labelStyle}>Client Name *</label>
            <input type="text" placeholder="e.g. Mike Johnson" value={notesClientName}
              onChange={e => setNotesClientName(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Your Session Notes * (rough notes are fine!)</label>
            <textarea
              placeholder="e.g. Mike did well today. Squats 3x10 at 80kg, struggled on last set. Bench press 3x8 at 60kg good form. Cardio 15 mins. Energy seemed low, said he had bad sleep. Needs to work on depth in squats. Next session increase bench to 65kg..."
              value={rawNotes}
              onChange={e => setRawNotes(e.target.value)}
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <button
              onClick={generateSessionNotes}
              disabled={loading || !notesClientName || !rawNotes}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '18px', fontWeight: 'bold',
                cursor: loading || !notesClientName || !rawNotes ? 'not-allowed' : 'pointer',
                opacity: loading || !notesClientName || !rawNotes ? 0.6 : 1
              }}>
              {loading ? '🤖 Formatting Notes...' : 'Format Session Notes 📝'}
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🤖</div>
            <h3 style={{ color: '#FF6B00', marginBottom: '8px' }}>AI is working...</h3>
            <p style={{ color: '#888' }}>This takes about 10-15 seconds ⏱️</p>
          </div>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0 }}>
                {result.type === 'fitness' ? '💪' : result.type === 'meal' ? '🥗' : '📝'}
                {' '}<span style={{ color: '#FF6B00' }}>
                  {result.type === 'fitness' ? 'Fitness Plan' : result.type === 'meal' ? 'Meal Plan' : 'Session Notes'}
                </span>
                {' '}— {result.clientName}
              </h2>
              <button
                onClick={() => { setResult(null); }}
                style={{
                  backgroundColor: 'transparent', color: '#FF6B00',
                  border: '2px solid #FF6B00', padding: '8px 16px',
                  borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                }}>Generate New</button>
            </div>

            <div style={{
              backgroundColor: '#111', border: '1px solid #333',
              borderRadius: '20px', padding: '30px'
            }}>
              <p style={{
                color: '#ccc', lineHeight: '1.9', whiteSpace: 'pre-wrap',
                margin: 0, fontSize: '15px'
              }}>
                {result.content}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.content);
                  alert('Copied to clipboard! 📋');
                }}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  border: '2px solid #FF6B00', backgroundColor: 'transparent',
                  color: '#FF6B00', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setActiveTool(null)}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  border: 'none', backgroundColor: '#FF6B00',
                  color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                Back to Tools 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PTTools;