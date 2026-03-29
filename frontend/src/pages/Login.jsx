import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserCheck, ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.location.href = '/dashboard';
            }
        } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px', background: 'var(--bg-body)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(13, 148, 136, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f0fdfa', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <ShieldCheck size={28}/>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Sign In</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back to Zenith Expense.</p>
                </div>

                {error && <div style={{ color: 'var(--danger)', background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '8px' }}>Log In</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Admin? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register Company</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
