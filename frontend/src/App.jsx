import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Application Navbar Component
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', background: '-webkit-linear-gradient(#60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Chigbo LangAI
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-muted)' }}>Hello, {user.username}</span>
            <Link to="/chat" style={{ color: '#fff', textDecoration: 'none' }}>Tutor Chat</Link>
            <button onClick={logout} className="btn" style={{ padding: '0.4rem 1rem', background: 'var(--danger)' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// New Home Page Component matching multi-lingual intent
const Home = () => {
  return (
    <div className="main-content">
      <div className="glass-panel animate-fade-in" style={{maxWidth: '800px', width: '100%', textAlign: 'center'}}>
        <h1 style={{fontSize: '3.5rem', marginBottom: '1rem', background: '-webkit-linear-gradient(#60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Bridging Languages With AI
        </h1>
        <p style={{color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '1.5rem'}}>
          Whether you are a Chinese citizen looking to master conversational Igbo, or an Igbo native learning Mandarin or English, your personal AI Language Tutor is here 24/7.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2.5rem', color: 'var(--text-main)', fontWeight: '500' }}>
          <div>🇨🇳 中文</div>
          <div>↔️</div>
          <div>🇳🇬 Igbo</div>
          <div>↔️</div>
          <div>🇬🇧 English</div>
        </div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link to="/register" className="btn">Start Learning Now</Link>
          <Link to="/login" className="btn" style={{background: 'transparent', border: '1px solid var(--glass-border)'}}>I already have an account</Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
