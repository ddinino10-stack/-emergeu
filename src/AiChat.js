import { useState } from 'react';

function AiChat({ onComplete }) {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: "Hi! I'm EmergeU's AI 👋🏼 I'm going to ask you a few quick questions to find your perfect PT. Let's start — what's your main fitness goal right now?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

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
          max_tokens: 300,
          system: `You are EmergeU's friendly AI matching assistant. Your job is to ask short, conversational questions to understand what kind of personal trainer would suit this person best.

You need to find out:
1. Their fitness goal (weight loss, muscle building, general fitness, sport specific)
2. Their experience level (beginner, intermediate, advanced)
3. Their preference for online, in person or hybrid training
4. Their weekly budget for PT
5. Their preferred coaching style (tough love vs encouraging and supportive)

Ask ONE question at a time. Keep responses short and friendly. Use emojis occasionally. After you have asked all 5 questions and received answers, respond with exactly this phrase and nothing else: "MATCHING_COMPLETE"`,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      console.log('API Response:', data);
      const aiText = data?.content?.[0]?.text || 'Sorry, could not get response';

      if (aiText.includes('MATCHING_COMPLETE')) {
        setMessages([...newMessages, { 
          role: 'ai', 
          text: "Amazing! 🔥 Based on everything you've told me I'm finding your perfect PT matches right now..." 
        }]);
        setTimeout(() => setDone(true), 2000);
      } else {
        setMessages([...newMessages, { role: 'ai', text: aiText }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { 
        role: 'ai', 
        text: "Sorry, something went wrong! Please try again 😅" 
      }]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 30px', borderBottom: '1px solid #222',
        display: 'flex', alignItems: 'center', gap: '16px',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img
          src={process.env.PUBLIC_URL + '/logo.jpg'}
          alt="EmergeU"
          style={{ height: '45px', borderRadius: '8px' }}
        />
        <div>
          <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>EmergeU AI</h3>
          <p style={{ color: '#FF6B00', margin: 0, fontSize: '13px' }}>Finding your perfect PT</p>
        </div>
        <button
          onClick={onComplete}
          style={{
            marginLeft: 'auto', backgroundColor: 'transparent',
            color: '#888', border: '1px solid #333', padding: '8px 16px',
            borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
          }}>
          Back to Dashboard
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, padding: '30px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxHeight: 'calc(100vh - 160px)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%', padding: '14px 18px', borderRadius: '18px',
              backgroundColor: msg.role === 'user' ? '#FF6B00' : '#1a1a1a',
              color: 'white', fontSize: '16px', lineHeight: '1.5',
              border: msg.role === 'ai' ? '1px solid #333' : 'none'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '14px 18px', borderRadius: '18px',
              backgroundColor: '#1a1a1a', border: '1px solid #333',
              color: '#888', fontSize: '16px'
            }}>
              EmergeU AI is thinking... 🤖
            </div>
          </div>
        )}

        {done && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #FF6B00',
            borderRadius: '16px', padding: '30px', textAlign: 'center',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ color: '#FF6B00', marginBottom: '10px' }}>Your matches are ready!</h3>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              We found 3 PTs perfectly matched to your goals and personality
            </p>
            <button
              onClick={onComplete}
              style={{
                backgroundColor: '#FF6B00', color: 'white', border: 'none',
                padding: '14px 30px', borderRadius: '25px', cursor: 'pointer',
                fontSize: '16px', fontWeight: 'bold'
              }}>
              See My Matches 🔥
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      {!done && (
        <div style={{
          padding: '20px 30px', borderTop: '1px solid #222',
          display: 'flex', gap: '12px', backgroundColor: 'rgba(0,0,0,0.8)'
        }}>
          <input
            type="text"
            placeholder="Type your answer..."
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
              padding: '14px 24px', borderRadius: '25px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px', fontWeight: 'bold', opacity: loading ? 0.7 : 1
            }}>
            Send 🚀
          </button>
        </div>
      )}
    </div>
  );
}

export default AiChat;