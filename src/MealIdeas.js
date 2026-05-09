/* eslint-disable */
import { useState, useRef } from 'react';
import { supabase } from './supabase';

function MealIdeas({ user, onBack }) {
  const [mode, setMode] = useState('text');
  const [calories, setCalories] = useState('');
  const [craving, setCraving] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [dietary, setDietary] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      const base64 = e.target.result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const generateFromText = async () => {
    if (!calories || !craving) return;
    setLoading(true);
    setResults(null);

    try {
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
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `You are a nutrition expert and chef. Generate exactly 3 meal ideas based on these requirements:

Calories remaining: ${calories} calories
Craving: ${craving}
Cook time preference: ${cookTime || 'any'}
Dietary preference: ${dietary || 'no restrictions'}

For each meal provide:
- Meal name
- Calories
- Protein, carbs, fat (macros)
- Key ingredients (simple list)
- Quick method (3-4 steps max)
- Why it satisfies the craving

Format each meal clearly with these exact headers:
MEAL 1: [name]
CALORIES: [number]
MACROS: [protein]g protein | [carbs]g carbs | [fat]g fat
INGREDIENTS: [list]
METHOD: [steps]
WHY IT WORKS: [explanation]

Keep it practical, delicious and achievable!`
          }]
        })
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text;

      if (text) {
        await supabase.from('meal_ideas').insert([{
          user_id: user?.id,
          calories,
          craving,
          cook_time: cookTime,
          dietary,
          result: text,
          created_at: new Date().toISOString()
        }]);
        setResults(text);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateFromPhoto = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setResults(null);

    try {
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
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: `You are a nutrition expert and creative chef. Look at the ingredients in this photo and suggest exactly 3 healthy meals that can be made with what you can see.

For each meal provide:
- Meal name
- Estimated calories
- Protein, carbs, fat (macros)
- Which visible ingredients are used
- Quick method (3-4 steps max)
- Nutrition benefit

Format each meal clearly with these exact headers:
MEAL 1: [name]
CALORIES: [number]
MACROS: [protein]g protein | [carbs]g carbs | [fat]g fat
INGREDIENTS USED: [from photo]
METHOD: [steps]
NUTRITION BENEFIT: [explanation]

If you cannot clearly identify ingredients, ask the user to retake the photo with better lighting.`
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text;
      if (text) setResults(text);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const parseMeals = (text) => {
    const meals = text.split(/MEAL \d+:/);
    return meals.filter(m => m.trim()).map(meal => {
      const lines = meal.trim().split('\n').filter(l => l.trim());
      const name = lines[0]?.trim() || 'Meal';
      const content = lines.slice(1).join('\n');
      return { name, content };
    });
  };

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
            <h3 style={{ color: 'white', margin: 0 }}>Meal Ideas</h3>
            <p style={{ color: '#FF6B00', margin: 0, fontSize: '13px' }}>AI powered meal inspiration</p>
          </div>
        </div>
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button
            onClick={() => { setMode('text'); setResults(null); }}
            style={{
              flex: 1, padding: '16px', borderRadius: '16px', cursor: 'pointer',
              border: `2px solid ${mode === 'text' ? '#FF6B00' : '#333'}`,
              backgroundColor: mode === 'text' ? 'rgba(255,107,0,0.1)' : '#111',
              color: mode === 'text' ? '#FF6B00' : '#888',
              fontSize: '16px', fontWeight: 'bold'
            }}>
            📝 Tell me what you fancy
          </button>
          <button
            onClick={() => { setMode('photo'); setResults(null); }}
            style={{
              flex: 1, padding: '16px', borderRadius: '16px', cursor: 'pointer',
              border: `2px solid ${mode === 'photo' ? '#FF6B00' : '#333'}`,
              backgroundColor: mode === 'photo' ? 'rgba(255,107,0,0.1)' : '#111',
              color: mode === 'photo' ? '#FF6B00' : '#888',
              fontSize: '16px', fontWeight: 'bold'
            }}>
            📷 Snap your ingredients
          </button>
        </div>

        {/* Text Mode */}
        {mode === 'text' && !results && (
          <div>
            <h2 style={{ marginBottom: '30px' }}>
              What are you <span style={{ color: '#FF6B00' }}>craving?</span>
            </h2>

            <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Calories remaining today 🔢
            </label>
            <input
              type="number"
              placeholder="e.g. 600"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1px solid #333', backgroundColor: '#1a1a1a',
                color: 'white', fontSize: '16px', marginBottom: '20px',
                boxSizing: 'border-box'
              }}
            />

            <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              What are you craving? 🍔
            </label>
            <input
              type="text"
              placeholder="e.g. burger, pasta, something sweet, a snack..."
              value={craving}
              onChange={e => setCraving(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1px solid #333', backgroundColor: '#1a1a1a',
                color: 'white', fontSize: '16px', marginBottom: '20px',
                boxSizing: 'border-box'
              }}
            />

            <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              How long to cook? ⏱️
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {['5 mins', '15 mins', '30 mins', 'Any'].map((time, i) => (
                <button key={i} onClick={() => setCookTime(time)} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${cookTime === time ? '#FF6B00' : '#333'}`,
                  backgroundColor: cookTime === time ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: cookTime === time ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold'
                }}>{time}</button>
              ))}
            </div>

            <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Dietary preference 🥗
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
              {['No restrictions', 'Vegetarian', 'Vegan', 'High protein', 'Low carb'].map((diet, i) => (
                <button key={i} onClick={() => setDietary(diet)} style={{
                  padding: '10px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${dietary === diet ? '#FF6B00' : '#333'}`,
                  backgroundColor: dietary === diet ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: dietary === diet ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold'
                }}>{diet}</button>
              ))}
            </div>

            <button
              onClick={generateFromText}
              disabled={loading || !calories || !craving}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px',
                border: 'none', backgroundColor: '#FF6B00', color: 'white',
                fontSize: '18px', fontWeight: 'bold',
                cursor: loading || !calories || !craving ? 'not-allowed' : 'pointer',
                opacity: loading || !calories || !craving ? 0.6 : 1
              }}>
              {loading ? '🤖 Generating ideas...' : 'Get Meal Ideas 🔥'}
            </button>
          </div>
        )}

        {/* Photo Mode */}
        {mode === 'photo' && !results && (
          <div>
            <h2 style={{ marginBottom: '12px' }}>
              Snap your <span style={{ color: '#FF6B00' }}>ingredients</span>
            </h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>
              Take a photo of your fridge, cupboard or ingredients and our AI will suggest what you can make! 📷
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${image ? '#FF6B00' : '#333'}`,
                borderRadius: '16px', padding: '40px',
                textAlign: 'center', cursor: 'pointer',
                backgroundColor: image ? 'rgba(255,107,0,0.05)' : '#111',
                marginBottom: '24px'
              }}>
              {image ? (
                <img src={image} alt="ingredients" style={{
                  maxWidth: '100%', maxHeight: '300px',
                  borderRadius: '12px', objectFit: 'cover'
                }} />
              ) : (
                <>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>📷</div>
                  <p style={{ color: '#FF6B00', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    Tap to take photo or upload
                  </p>
                  <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>
                    Works best with good lighting 💡
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            {image && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setImage(null); setImageBase64(null); }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    border: '1px solid #333', backgroundColor: 'transparent',
                    color: '#888', fontSize: '16px', cursor: 'pointer'
                  }}>
                  Retake 🔄
                </button>
                <button
                  onClick={generateFromPhoto}
                  disabled={loading}
                  style={{
                    flex: 2, padding: '14px', borderRadius: '12px',
                    border: 'none', backgroundColor: '#FF6B00', color: 'white',
                    fontSize: '16px', fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}>
                  {loading ? '🤖 Analysing ingredients...' : 'Analyse & Get Ideas 🔥'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🤖</div>
            <h3 style={{ color: '#FF6B00', marginBottom: '8px' }}>
              {mode === 'photo' ? 'Analysing your ingredients...' : 'Creating your meal ideas...'}
            </h3>
            <p style={{ color: '#888' }}>This takes a few seconds ⏱️</p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2>Your <span style={{ color: '#FF6B00' }}>Meal Ideas</span> 🎯</h2>
              <button
                onClick={() => { setResults(null); setImage(null); setImageBase64(null); }}
                style={{
                  backgroundColor: 'transparent', color: '#FF6B00',
                  border: '2px solid #FF6B00', padding: '10px 20px',
                  borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
                }}>
                Try Again 🔄
              </button>
            </div>

            {parseMeals(results).map((meal, i) => (
              <div key={i} style={{
                backgroundColor: '#111',
                border: `1px solid ${i === 0 ? '#FF6B00' : '#222'}`,
                borderRadius: '20px', padding: '24px',
                marginBottom: '20px'
              }}>
                {i === 0 && (
                  <span style={{
                    backgroundColor: '#FF6B00', color: 'white',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 'bold', marginBottom: '12px',
                    display: 'inline-block'
                  }}>⭐ Top Pick</span>
                )}
                <h3 style={{ color: '#FF6B00', margin: '8px 0 16px 0', fontSize: '20px' }}>
                  {i + 1}. {meal.name}
                </h3>
                <p style={{ color: '#ccc', lineHeight: '1.8', whiteSpace: 'pre-line', margin: 0 }}>
                  {meal.content}
                </p>
              </div>
            ))}

            <button
              onClick={() => { setResults(null); setImage(null); setImageBase64(null); setCraving(''); setCalories(''); }}
              style={{
                width: '100%', padding: '16px', borderRadius: '12px',
                border: 'none', backgroundColor: '#FF6B00', color: 'white',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
              }}>
              Generate New Ideas 🔥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealIdeas;