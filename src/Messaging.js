/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

function Messaging({ user, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, () => fetchMessages(selectedConversation.id))
        .subscribe();
      return () => subscription.unsubscribe();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (data) {
      const unique = {};
      data.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherName = msg.sender_id === user.id ? msg.receiver_name : msg.sender_name;
        if (!unique[otherId]) {
          unique[otherId] = { id: otherId, name: otherName, lastMessage: msg.message };
        }
      });
      setConversations(Object.values(unique));
    }
    setLoading(false);
  };

  const fetchMessages = async (otherId) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const userName = user?.user_metadata?.name || 'User';
    await supabase.from('messages').insert([{
      sender_id: user.id,
      receiver_id: selectedConversation.id,
      message: newMessage,
      sender_name: userName,
      receiver_name: selectedConversation.name
    }]);
    setNewMessage('');
    fetchMessages(selectedConversation.id);
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white',
      display: 'flex', flexDirection: 'column'
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
            <h3 style={{ color: 'white', margin: 0 }}>Messages</h3>
            <p style={{ color: '#FF6B00', margin: 0, fontSize: '13px' }}>Your conversations</p>
          </div>
        </div>
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 85px)' }}>

        {/* Conversations List */}
        <div style={{
          width: '300px', borderRight: '1px solid #222',
          overflowY: 'auto', flexShrink: 0
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
            <h4 style={{ color: '#888', margin: 0, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Conversations
            </h4>
          </div>

          {loading ? (
            <p style={{ color: '#555', padding: '20px' }}>Loading...</p>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <p style={{ color: '#555', fontSize: '14px' }}>No conversations yet</p>
              <p style={{ color: '#444', fontSize: '12px' }}>
                Once matched with a PT your conversation will appear here
              </p>
            </div>
          ) : (
            conversations.map((conv, i) => (
              <div key={i}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #111',
                  backgroundColor: selectedConversation?.id === conv.id ? '#1a1a1a' : 'transparent',
                  borderLeft: selectedConversation?.id === conv.id ? '3px solid #FF6B00' : '3px solid transparent'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: '#FF6B00', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '18px', flexShrink: 0
                  }}>💪</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ color: 'white', margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '15px' }}>
                      {conv.name}
                    </p>
                    <p style={{ color: '#555', margin: 0, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedConversation ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ color: '#555', margin: 0 }}>Select a conversation</h3>
              <p style={{ color: '#444', marginTop: '8px', fontSize: '14px' }}>
                Choose a conversation from the left to start messaging
              </p>
            </div>
          ) : (
            <>
              {/* Conversation Header */}
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid #222',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: '#FF6B00', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px'
                }}>💪</div>
                <div>
                  <p style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>{selectedConversation.name}</p>
                  <p style={{ color: '#555', margin: 0, fontSize: '12px' }}>EmergeU PT</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ color: '#555' }}>No messages yet — say hello! 👋🏼</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start'
                    }}>
                      <div style={{
                        maxWidth: '65%', padding: '12px 16px', borderRadius: '18px',
                        backgroundColor: msg.sender_id === user.id ? '#FF6B00' : '#1a1a1a',
                        color: 'white', fontSize: '15px', lineHeight: '1.5',
                        border: msg.sender_id !== user.id ? '1px solid #333' : 'none'
                      }}>
                        <p style={{ margin: '0 0 4px 0' }}>{msg.message}</p>
                        <p style={{ margin: 0, fontSize: '11px', opacity: 0.6, textAlign: 'right' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: '16px 24px', borderTop: '1px solid #222',
                display: 'flex', gap: '12px', backgroundColor: 'rgba(0,0,0,0.8)'
              }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  style={{
                    flex: 1, padding: '12px 18px', borderRadius: '25px',
                    border: '1px solid #333', backgroundColor: '#1a1a1a',
                    color: 'white', fontSize: '15px', outline: 'none'
                  }}
                />
                <button onClick={sendMessage} style={{
                  backgroundColor: '#FF6B00', color: 'white', border: 'none',
                  padding: '12px 20px', borderRadius: '25px', cursor: 'pointer',
                  fontSize: '18px'
                }}>🚀</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messaging;