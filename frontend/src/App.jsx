import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

const Home = () => {
  return (
    <div className="main-content">
      <div className="glass-panel animate-fade-in" style={{maxWidth: '800px', width: '100%', textAlign: 'center'}}>
        <h1 style={{fontSize: '3.5rem', marginBottom: '1rem', background: '-webkit-linear-gradient(#60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Chigbo Language AI
        </h1>
        <p style={{color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2.5rem'}}>
          Learn Igbo and Chinese with your personal AI Tutor.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link to="/login" className="btn">Get Started</Link>
          <Link to="/lessons" className="btn" style={{background: 'transparent', border: '1px solid var(--glass-border)'}}>Explore Lessons</Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div className="main-content"><div className="glass-panel animate-fade-in"><h2>Login Portal</h2><p>Coming Soon...</p></div></div>} />
          <Route path="/lessons" element={<div className="main-content"><div className="glass-panel animate-fade-in"><h2>Learning Modules</h2><p>Coming Soon...</p></div></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
