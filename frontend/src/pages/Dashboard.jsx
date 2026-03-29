import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Receipt, CheckCircle, Clock, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    // Stats based on role
    const getRoleStats = () => {
        if (user?.role === 'admin') {
            return [
                { label: 'Active Employees', value: '42', icon: <Users size={20}/>, color: 'var(--primary)', bg: '#f0fdfa' },
                { label: 'Total Processed', value: '$124,500', icon: <TrendingUp size={20}/>, color: '#0d9488', bg: '#ccfbf1' },
                { label: 'Company Policies', value: 'Active', icon: <ShieldCheck size={20}/>, color: '#ca8a04', bg: 'var(--accent-light)' }
            ];
        } else if (user?.role === 'manager') {
            return [
                { label: 'Pending Approvals', value: '7', icon: <Clock size={20}/>, color: 'var(--warning)', bg: '#fef3c7' },
                { label: 'Team Expenses', value: '$4,230', icon: <Receipt size={20}/>, color: 'var(--primary)', bg: '#f0fdfa' },
                { label: 'Approved this Month', value: '18', icon: <CheckCircle size={20}/>, color: '#10b981', bg: '#d1fae5' }
            ];
        } else {
            return [
                { label: 'My Pending Claims', value: '2', icon: <Clock size={20}/>, color: 'var(--warning)', bg: '#fef3c7' },
                { label: 'Total Reimbursed', value: '$850', icon: <TrendingUp size={20}/>, color: 'var(--primary)', bg: '#f0fdfa' },
                { label: 'Drafts', value: '1', icon: <Receipt size={20}/>, color: 'var(--text-muted)', bg: '#f1f5f9' }
            ];
        }
    };

    const stats = getRoleStats();

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
                    Here's what's happening with your expenses today.
                </p>
            </div>

            {/* Hero Image Section */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px', border: '1px solid var(--border)', background: 'linear-gradient(135deg, #f0fdfa 0%, #fffbeb 100%)', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f766e', marginBottom: '12px' }}>Enterprise Expense Management</h2>
                        <p style={{ color: '#4d7c0f', fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
                            {user?.role === 'employee' 
                                ? "Submit your reimbursements easily with our automated OCR receipt scanning."
                                : user?.role === 'manager'
                                ? "Review and approve your team's expense claims with just a single click."
                                : "Manage company-wide approval workflows and monitor global organizational spending."
                            }
                        </p>
                        <div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#ccfbf1', color: '#134e4a', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                                <ShieldCheck size={14}/> Secured by Zenith Expense
                            </span>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <img 
                            src="/dashboard_hero.png" 
                            alt="Finance Dashboard Illustration" 
                            style={{ width: '100%', maxWidth: '400px', objectFit: 'cover', transform: 'scale(1.1) translateX(-20px)' }}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
