import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    native_language: 'zh-hans', 
    target_language: 'ig'
  });
  
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingLocal(true);
    try {
      await register(formData);
      // After successful registration, route them to login
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username may be taken, or check connection.');
      console.error(err);
    } finally {
      setLoadingLocal(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' };

  return (
    <div className="main-content">
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Email (Optional)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} style={inputStyle} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Native Language</label>
              <select name="native_language" value={formData.native_language} onChange={handleChange} style={inputStyle}>
                <option value="zh-hans" style={{color: '#000'}}>Mandarin Chinese</option>
                <option value="en" style={{color: '#000'}}>English</option>
                <option value="ig" style={{color: '#000'}}>Igbo</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Learning</label>
              <select name="target_language" value={formData.target_language} onChange={handleChange} style={inputStyle}>
                <option value="ig" style={{color: '#000'}}>Igbo</option>
                <option value="zh-hans" style={{color: '#000'}}>Mandarin Chinese</option>
                <option value="en" style={{color: '#000'}}>English</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }} disabled={loadingLocal}>
            {loadingLocal ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
