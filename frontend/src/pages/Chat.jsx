import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Nnọọ (Hello) ${user?.username}!\nI'm your AI Language Tutor. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [overrideLanguage, setOverrideLanguage] = useState(user?.target_language || 'ig');
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom every time messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat/', {
        message: userMsg,
        language: overrideLanguage === 'ig' ? 'Igbo' : overrideLanguage === 'zh-hans' ? 'Chinese' : 'English',
        level: user?.current_level || 0
      });

      const aiText = response.data.response;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%', maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Top Bar for Dynamic Toggle */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>AI Tutor Workspace</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Currently Learning:</span>
          <select 
            value={overrideLanguage} 
            onChange={(e) => setOverrideLanguage(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
          >
            <option value="ig" style={{color: '#000'}}>Igbo</option>
            <option value="zh-hans" style={{color: '#000'}}>Mandarin</option>
            <option value="en" style={{color: '#000'}}>English</option>
          </select>
        </div>
      </div>

      {/* Chat History View */}
      <div 
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem', paddingRight: '0.5rem' }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div 
              style={{
                maxWidth: '75%',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                // Conditional styling based on the role
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--glass-bg)',
                border: msg.role === 'ai' ? '1px solid var(--glass-border)' : 'none',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '16px', color: 'var(--text-muted)' }}>
              <em>Tutor is typing...</em>
            </div>
          </div>
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or practice a sentence..."
          style={{ flex: 1, padding: '1rem', borderRadius: '24px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" className="btn" style={{ borderRadius: '24px', padding: '0 2rem' }} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
