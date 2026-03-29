import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MessageCircle, Clock, Eye, User, FileText, Image as ImageIcon } from 'lucide-react';

const Approvals = () => {
    const [pending, setPending] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [actionData, setActionData] = useState({ id: null, comment: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [viewReceipt, setViewReceipt] = useState(null);

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expenses');
            if (res.data.success) {
                setPending(res.data.expenses.filter(e => e.status === 'pending' || e.status === 'in_progress'));
            }
        } catch (err) { console.error(err); } finally { setFetching(false); }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/expenses/approve/${actionData.id}`, { 
                status: actionData.status, 
                comment: actionData.comment 
            });
            setShowModal(false);
            setActionData({ id: null, comment: '', status: '' });
            fetchPending();
        } catch (err) { alert('Action failed: ' + (err.response?.data?.message || 'Error occurred')); }
    };

    const openModal = (id, status) => {
        setActionData({ id, status, comment: '' });
        setShowModal(true);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Pending Approvals</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Review and provide feedback on employee expense claims.</p>
            </div>

            <div className="table-container card">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Amount (Base)</th>
                            <th>Category</th>
                            <th>Description & AI Analysis</th>
                            <th>Submitted On</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pending.length === 0 && !fetching && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No pending approvals left for review!</td></tr>
                        )}
                        {pending.map(exp => (
                            <tr key={exp.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdfa', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                                            {exp.User?.name[0].toUpperCase() || 'U'}
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{exp.User?.name || 'Unknown User'}</span>
                                    </div>
                                </td>
                                <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{exp.amount_in_base_currency} <span style={{ fontSize: '12px' }}>USD</span></td>
                                <td><span className="badge" style={{ background: '#f0fdfa', color: 'var(--primary)', border: '1px solid #ccfbf1' }}>{exp.category}</span></td>
                                <td style={{ maxWidth: '300px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: exp.risk_flags?.length > 0 ? '6px' : '0' }} title={exp.description}>{exp.description || 'No description provided'}</div>
                                    {exp.risk_flags?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {exp.risk_flags.map((flag, idx) => (
                                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: exp.risk_level === 'high' ? '#fee2e2' : '#fef3c7', color: exp.risk_level === 'high' ? '#991b1b' : '#b45309', border: `1px solid ${exp.risk_level === 'high' ? '#fecaca' : '#fde68a'}` }}>
                                                    ⚠️ AI Flag: {flag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                        {exp.receipt_url && (
                                            <button className="btn btn-outline" style={{ borderColor: '#e2e8f0', color: '#64748b', background: 'white' }} onClick={() => setViewReceipt(exp.receipt_url)}>
                                                <FileText size={16}/> Receipt
                                            </button>
                                        )}
                                        <button className="btn btn-outline" style={{ borderColor: '#dcfce7', color: '#166534', background: '#f0fdf4' }} onClick={() => openModal(exp.id, 'approved')}>
                                            <Check size={16}/> Approve
                                        </button>
                                        <button className="btn btn-outline" style={{ borderColor: '#fee2e2', color: '#991b1b', background: '#fef2f2' }} onClick={() => openModal(exp.id, 'rejected')}>
                                            <X size={16}/> Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Receipt Modal */}
            {viewReceipt && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(8px)' }} onClick={() => setViewReceipt(null)}>
                    <div className="card" style={{ width: '90%', maxWidth: '600px', padding: '16px', background: 'white', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewReceipt(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ImageIcon size={20} color="var(--primary)" /> Receipt Preview
                        </h2>
                        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <img src={`http://localhost:5000/${viewReceipt.replace(/\\/g, '/')}`} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.parentElement.innerHTML = 'Image Not Found'; }} />
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px', background: 'white', boxShadow: '10px 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', background: actionData.status === 'approved' ? '#f0fdf4' : '#fef2f2', color: actionData.status === 'approved' ? 'var(--success)' : 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 {actionData.status === 'approved' ? <Check size={24}/> : <X size={24}/>}
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Confirm {actionData.status.charAt(0).toUpperCase() + actionData.status.slice(1)}</h2>
                        </div>
                        
                        <form onSubmit={handleAction}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Provide a brief reason for {actionData.status === 'approved' ? 'approving' : 'rejecting'} this claim.</p>
                            <textarea 
                                placeholder="Add your comments here..." 
                                style={{ minHeight: '100px', marginBottom: '20px' }}
                                value={actionData.comment}
                                onChange={e => setActionData({ ...actionData, comment: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Back</button>
                                <button type="submit" className={`btn ${actionData.status === 'approved' ? 'btn-primary' : ''}`} style={{ flex: 2, background: actionData.status === 'rejected' ? 'var(--danger)' : '', color: 'white' }}>
                                    Confirm Action
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
