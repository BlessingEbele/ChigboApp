import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { synthesizeAudio } from '../services/api';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [overrideLanguage, setOverrideLanguage] = useState(user?.target_language || 'ig');
  
  // TTS States
  const [pronounceText, setPronounceText] = useState('');
  const [pronounceLang, setPronounceLang] = useState('ig');
  const [isPronouncing, setIsPronouncing] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom every time messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{ role: 'ai', text: `Nnọọ (Hello) ${user.username}!\nI'm your AI Language Tutor. How can I help you today?` }]);
    }
  }, [user]);

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
        level: user?.current_level || 0,
        native_language: user?.native_language || 'en'
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

  const playPronunciation = async () => {
    if (!pronounceText.trim()) return;
    setIsPronouncing(true);
    try {
      const audioUrl = await synthesizeAudio(pronounceText, pronounceLang);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (e) {
      console.error("Audio generation failed: ", e);
    } finally {
      setIsPronouncing(false);
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
              {msg.role === 'ai' ? (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{margin: '0 0 0.5rem 0'}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{margin: '0.5rem 0 0.5rem 1.5rem'}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: '0.2rem'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{fontWeight: '700', color: '#60a5fa'}} {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
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

      {/* TTS Pronunciation Mini-Widget */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--glass-border)' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>TTS:</span>
        <input 
          type="text" 
          value={pronounceText}
          onChange={e => setPronounceText(e.target.value)}
          placeholder="Paste word to hear..."
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
        />
        <select value={pronounceLang} onChange={e => setPronounceLang(e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: '0.85rem' }}>
          <option value="ig">Igbo</option>
          <option value="zh-CN">Chinese</option>
          <option value="en">English</option>
        </select>
        <button onClick={playPronunciation} disabled={isPronouncing} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' }}>
          {isPronouncing ? '...' : '▶'}
        </button>
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
