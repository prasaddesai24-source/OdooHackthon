import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users as UsersIcon, Settings, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18}/>, path: '/dashboard', roles: ['admin', 'manager', 'employee'] },
        { name: 'Expenses', icon: <Receipt size={18}/>, path: '/expenses', roles: ['employee'] },
        { name: 'Users', icon: <UsersIcon size={18}/>, path: '/users', roles: ['admin'] },
        { name: 'Approvals', icon: <CheckCircle size={18}/>, path: '/approvals', roles: ['manager', 'admin'] },
        { name: 'Settings', icon: <Settings size={18}/>, path: '/settings', roles: ['admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div style={{ width: 'var(--sidebar-w)', height: '100vh', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 }}>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                   <CheckCircle size={20}/>
                </div>
                <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Zenith Expense</h1>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '12px' }}>Menu</p>
                {filteredItems.map((item) => (
                    <NavLink key={item.name} to={item.path} style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? 'var(--primary)' : 'var(--text-main)',
                        background: isActive ? '#f0fdfa' : 'transparent', fontWeight: isActive ? '600' : '500', transition: '0.2s', fontSize: '14px'
                    })}>
                        {({ isActive }) => (
                            <>
                                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>{item.icon}</span>
                                <span>{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0fdfa', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{user?.name || 'User'}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role || 'member'}</p>
                    </div>
                </div>
                <button onClick={logout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', border: '1px solid #fee2e2', color: '#991b1b', background: '#fff1f2' }}>
                    <LogOut size={16}/> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
