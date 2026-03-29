import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Globe, Building2, User } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    company_name: '', country_code: 'US', currency: 'USD'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/dashboard';
      }
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px', background: 'var(--bg-body)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(13, 148, 136, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: '#f0fdfa', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
             <ShieldCheck size={28}/>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Create Admin Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Setup your company and first admin user.</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Admin Name</label>
                <input name="name" placeholder="Alice Smith" onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Admin Email</label>
                <input name="email" type="email" placeholder="alice@company.com" onChange={handleChange} required />
              </div>
          </div>
          
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Password</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '8px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent)' }}>
                <Building2 size={18}/>
                <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Company Details</h3>
             </div>
             <input name="company_name" placeholder="Company Name" onChange={handleChange} required style={{ marginBottom: '16px' }} />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <select name="currency" onChange={handleChange}>
                   <option value="USD">USD</option>
                   <option value="INR">INR</option>
                   <option value="GBP">GBP</option>
                </select>
                <select name="country_code" onChange={handleChange}>
                   <option value="US">USA (US)</option>
                   <option value="IN">INDIA (IN)</option>
                   <option value="GB">UK (GB)</option>
                </select>
             </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '16px' }}>Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Alrealy have a profile? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
