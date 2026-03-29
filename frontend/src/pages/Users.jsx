import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Users as UsersIcon, Mail, Shield, UserCheck } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee', manager_id: '', team: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, managersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/users/managers')
            ]);
            setUsers(usersRes.data.users);
            setManagers(managersRes.data.managers);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'employee', manager_id: '', team: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Team Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create and manage employees, managers, and their relationships.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', color: 'var(--primary)' }} onClick={() => { setFormData({ ...formData, team: 'New Team' }); setShowModal(true); }}>
                        <UsersIcon size={18}/> Add Team
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <UserPlus size={18}/> Add Team Member
                    </button>
                </div>
            </div>

            <div className="table-container card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Team</th>
                            <th>Role</th>
                            <th>Reports To</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px' }}>
                                            {u.name[0].toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{u.name}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: 'var(--accent-light)', color: '#92400e', border: '1px solid #fde68a' }}>
                                        {u.team || 'No Team'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${u.role === 'admin' ? 'badge-approved' : u.role === 'manager' ? 'badge-pending' : 'badge-rejected'}`} style={{ textTransform: 'capitalize' }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>{u.manager_id ? users.find(m => m.id === u.manager_id)?.name : '-'}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(u.created_at || Date.now()).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '32px', background: 'white', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(13, 148, 136, 0.15)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Add Team Member</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Fill in the details to create a new company account.</p>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Full Name</label>
                                <input placeholder="John Doe" onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
                                <input type="email" placeholder="john@company.com" onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Default Password</label>
                                <input type="password" placeholder="••••••••" onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Team Name</label>
                                <input placeholder="e.g. Engineering, Sales" value={formData.team} onChange={e => setFormData({ ...formData, team: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Role</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Reports To</label>
                                    <select value={formData.manager_id} onChange={e => setFormData({ ...formData, manager_id: e.target.value })}>
                                        <option value="">No Manager</option>
                                        {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
