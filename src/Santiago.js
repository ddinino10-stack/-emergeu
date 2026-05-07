/* eslint-disable */
import { useState, useRef, useEffect } from 'react';

function Santiago({ onBack }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hey! I'm Santiago, your personal AI fitness coach 💪🏼 I'm here 24/7 to help you with workout plans, nutrition advice, meal plans and anything fitness related. What are we working on today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));

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
          max_tokens: 1000,
          system: `You are Santiago, a world class personal fitness coach and nutritionist. You work for EmergeU, a premium fitness platform.

Your personality:
- Motivating, direct and knowledgeable
- Friendly but professional
- You speak like a real PT — not robotic
- You use occasional emojis but not excessively
- You're passionate about fitness and genuinely care about results
- You give specific, actionable advice — not generic waffle
- When creating meal plans or workout plans, make them detailed and personalised
- You always ask follow up questions to personalise advice better
- You occasionally reference your own fitness journey to build rapport

Your expertise:
- Weight loss and body recomposition
- Muscle building and strength training
- Nutrition and meal planning
- HIIT and cardio programming
- Injury prevention and rehabilitation
- Mindset and motivation
- Supplement advice
- Sleep and recovery

Important rules:
- Always ask about injuries or health conditions before recommending exercise
- Never diagnose medical conditions — refer to doctors when appropriate
- Keep advice evidence based
- When creating workout plans specify sets, reps, rest periods and progression
- When creating meal plans specify portions, macros and meal timing
- Always end responses with an actionable next step or question

You are NOT a general AI assistant — you only discuss fitness, nutrition, health and wellbeing. If asked about anything else politely redirect back to fitness.`,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      const aiText = data?.content?.[0]?.text || 'Sorry, I could not respond right now. Please try again!';
      setMessages([...newMessages, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, {
        role: 'ai',
        text: "Sorry, something went wrong! Try again in a moment 💪🏼"
      }]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 30px', borderBottom: '1px solid #222',
        display: 'flex', alignItems: 'center', gap: '16px',
        backgroundColor: 'rgba(0,0,0,0.9)'
      }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B00, #ff9500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', flexShrink: 0,
          boxShadow: '0 0 20px rgba(255,107,0,0.4)'
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Santiago</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#00ff88', animation: 'pulse 2s infinite'
            }}></div>
            <p style={{ color: '#00ff88', margin: 0, fontSize: '12px' }}>Online — Your AI PT</p>
          </div>
        </div>
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </div>

      {/* Quick Action Buttons */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #111',
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        backgroundColor: '#050505'
      }}>
        {[
          '💪 Create Workout Plan',
          '🥗 Generate Meal Plan',
          '🔥 Help Me Lose Weight',
          '📊 Track My Progress',
          '😴 Recovery Advice'
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(action.substring(3));
            }}
            style={{
              backgroundColor: '#111', border: '1px solid #333',
              color: '#888', padding: '8px 16px', borderRadius: '20px',
              cursor: 'pointer', fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.borderColor = '#FF6B00';
              e.target.style.color = '#FF6B00';
            }}
            onMouseOut={e => {
              e.target.style.borderColor = '#333';
              e.target.style.color = '#888';
            }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, padding: '24px 20px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxHeight: 'calc(100vh - 240px)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end', gap: '10px'
          }}>
            {msg.role === 'ai' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B00, #ff9500)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px', flexShrink: 0
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: '70%', padding: '14px 18px', borderRadius: '18px',
              backgroundColor: msg.role === 'user' ? '#FF6B00' : '#1a1a1a',
              color: 'white', fontSize: '15px', lineHeight: '1.6',
              border: msg.role === 'ai' ? '1px solid #333' : 'none',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '18px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00, #ff9500)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px'
            }}>🤖</div>
            <div style={{
              padding: '14px 18px', borderRadius: '18px',
              backgroundColor: '#1a1a1a', border: '1px solid #333',
              display: 'flex', gap: '6px', alignItems: 'center'
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: '#FF6B00', opacity: 0.6
                }}></div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px', borderTop: '1px solid #222',
        display: 'flex', gap: '12px', backgroundColor: 'rgba(0,0,0,0.9)'
      }}>
        <input
          type="text"
          placeholder="Ask Santiago anything about fitness..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: '25px',
            border: '1px solid #333', backgroundColor: '#1a1a1a',
            color: 'white', fontSize: '16px', outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            backgroundColor: '#FF6B00', color: 'white', border: 'none',
            padding: '14px 24px', borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px', fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default Santiago;