/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { supabase } from './supabase';
import Subscribe from './Subscribe';

const PREMIUM_KEYWORDS = [
  'meal plan', 'workout plan', 'training programme', 'training program',
  'diet plan', 'nutrition plan', 'fitness plan', 'exercise plan',
  'workout programme', 'weekly plan', 'monthly plan', 'training plan'
];

function Emma({ user, onBack }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi lovely! I'm Emma, your personal AI fitness coach 🌟 I'm here whenever you need me — whether that's workout advice, nutrition guidance, or just someone to talk to about your fitness journey. What are we working on today? 💗"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkSubscription = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    if (data) setIsPro(true);
  };

  const isPremiumRequest = (text) => {
    const lower = text.toLowerCase();
    return PREMIUM_KEYWORDS.some(keyword => lower.includes(keyword));
  };

  const sendMessage = async () => {
    console.log('sendMessage called');
    console.log('input:', input);
    if (!input.trim() || loading) return;
    console.log('proceeding...');

    const userMessage = input;
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');

    if (!isPro && isPremiumRequest(userMessage)) {
      setTimeout(() => {
        setMessages([...newMessages, {
          role: 'ai',
          text: "I would absolutely love to create a personalised plan just for you! 💗 This is an Emma Pro feature — upgrade for unlimited meal plans, workout programmes and so much more for just £9.99/month 🌟"
        }]);
        setTimeout(() => setShowPaywall(true), 1500);
      }, 800);
      return;
    }

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
          max_tokens: 600,
          system: `You are Emma, a warm and supportive personal fitness coach working for EmergeU, a premium fitness platform.

Your personality:
- Warm, caring and genuinely encouraging
- You celebrate every win no matter how small
- You never make anyone feel judged or inadequate
- You're patient and understanding
- You use warm language — "lovely", "amazing", "you've got this"
- You understand the emotional side of fitness journeys
- You use emojis warmly but not excessively 💗🌟✨
- You speak like a supportive best friend who happens to be a fitness expert

Your specialist areas:
- Women's fitness and body confidence
- Sustainable healthy habits (not crash diets)
- Pre and postnatal fitness
- Managing fitness around hormones and cycles
- Strength training for women
- Mental wellbeing and fitness
- Body positive approaches to health
- Stress management through movement

Your expertise:
- Weight loss done sustainably and kindly
- Muscle toning and strength building
- Nutrition and meal planning
- Low impact and home workouts
- Yoga and flexibility
- Sleep and recovery
- Mindset and self confidence

Important rules:
- Always ask about injuries, health conditions or pregnancy before recommending exercise
- Never use negative language about bodies
- Never suggest extreme diets or rapid weight loss
- Keep advice evidence based and safe
- Always validate feelings before giving advice
- When creating workout plans be specific but encouraging
- Always end with a warm encouraging message

You are NOT a general AI — only discuss fitness, nutrition, health and wellbeing. If asked about anything else gently redirect back to their wellness journey.`,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      const aiText = data?.content?.[0]?.text || "I'm so sorry, something went wrong! Please try again lovely 💗";
      setMessages([...newMessages, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, {
        role: 'ai',
        text: "Something went wrong! Don't worry, just try again 💗"
      }]);
    }

    setLoading(false);
  };

  if (showPaywall) return (
    <Subscribe
      user={user}
      onBack={() => setShowPaywall(false)}
      onSuccess={() => {
        setIsPro(true);
        setShowPaywall(false);
        setMessages(prev => [...prev, {
          role: 'ai',
          text: "Welcome to Emma Pro gorgeous! 🎉💗 You now have full access to personalised meal plans, workout programmes and everything else. I am SO excited to work with you properly — what would you like to start with?"
        }]);
      }}
    />
  );

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
          background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', flexShrink: 0,
          boxShadow: '0 0 20px rgba(233,30,140,0.4)'
        }}>👩</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Emma</h3>
            {isPro && (
              <span style={{
                backgroundColor: '#e91e8c', color: 'white',
                padding: '2px 10px', borderRadius: '10px',
                fontSize: '11px', fontWeight: 'bold'
              }}>PRO 💗</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#00ff88'
            }}></div>
            <p style={{ color: '#00ff88', margin: 0, fontSize: '12px' }}>Online — Your AI PT</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isPro && (
            <button
              onClick={() => setShowPaywall(true)}
              style={{
                backgroundColor: '#e91e8c', color: 'white', border: 'none',
                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 'bold'
              }}>💗 Go Pro</button>
          )}
          <button onClick={onBack} style={{
            backgroundColor: 'transparent', color: '#888',
            border: '1px solid #333', padding: '8px 16px',
            borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
          }}>Back</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #111',
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        backgroundColor: '#050505'
      }}>
        {[
          { label: '💪 Create Workout Plan', pro: true },
          { label: '🥗 Generate Meal Plan', pro: true },
          { label: '🌸 Women\'s Fitness Advice', pro: false },
          { label: '😌 Stress & Wellness', pro: false },
          { label: '🧘 Yoga & Flexibility', pro: false }
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => setInput(action.label.substring(3))}
            style={{
              backgroundColor: '#111',
              border: `1px solid ${action.pro && !isPro ? '#e91e8c' : '#333'}`,
              color: action.pro && !isPro ? '#e91e8c' : '#888',
              padding: '8px 16px', borderRadius: '20px',
              cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
            {action.label}
            {action.pro && !isPro && <span style={{ fontSize: '10px' }}>💗PRO</span>}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, padding: '24px 20px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxHeight: 'calc(100vh - 250px)'
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
                background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px', flexShrink: 0
              }}>👩</div>
            )}
            <div style={{
              maxWidth: '70%', padding: '14px 18px', borderRadius: '18px',
              backgroundColor: msg.role === 'user' ? '#e91e8c' : '#1a1a1a',
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
              background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px'
            }}>👩</div>
            <div style={{
              padding: '14px 18px', borderRadius: '18px',
              backgroundColor: '#1a1a1a', border: '1px solid #333',
              display: 'flex', gap: '6px', alignItems: 'center'
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: '#e91e8c', opacity: 0.6
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
          placeholder={isPro ? "Ask Emma anything..." : "Ask Emma a question..."}
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
            backgroundColor: '#e91e8c', color: 'white', border: 'none',
            padding: '14px 24px', borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px', fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}>
          Send 💗
        </button>
      </div>
    </div>
  );
}

export default Emma;