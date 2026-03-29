import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Receipt, History, Image as ImageIcon, CheckCircle2, XCircle, Clock, Info, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [activeTab, setActiveTab] = useState('present');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ amount: '', currency: 'USD', category: 'Meals', description: '', date: new Date().toISOString().split('T')[0] });
    const [file, setFile] = useState(null);
    const [viewDetails, setViewDetails] = useState(null);
    const { user } = useAuth();

    useEffect(() => { fetchExpenses(); }, []);

    const fetchExpenses = async () => {
        const res = await axios.get('http://localhost:5000/api/expenses');
        if (res.data.success) setExpenses(res.data.expenses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (file) data.append('receipt', file);
            await axios.post('http://localhost:5000/api/expenses', data);
            setShowModal(false);
            setFile(null);
            fetchExpenses();
        } catch (error) {
            console.error('Submit Error:', error);
            alert(error.response?.data?.message || error.message || 'Failed to submit expense');
        }
    };

    const filteredExpenses = expenses.filter(exp => 
        activeTab === 'present' ? exp.status === 'pending' || exp.status === 'in_progress' : exp.status === 'approved' || exp.status === 'rejected'
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>My Expenses</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track your reimbursement requests and their status.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18}/> New Claim
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('present')} style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'present' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'present' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600' }}>Active Claims</button>
                <button onClick={() => setActiveTab('history')} style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600' }}>History</button>
            </div>

            <div className="table-container card">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount (Base)</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(exp => (
                            <tr key={exp.id} onClick={() => setViewDetails(exp)} style={{ cursor: 'pointer' }} className="hover-row">
                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{exp.amount_in_base_currency} <span style={{ fontSize: '12px' }}>USD</span></td>
                                <td><span className="badge" style={{ background: '#f0fdfa', color: 'var(--primary)', border: '1px solid #ccfbf1' }}>{exp.category}</span></td>
                                <td>
                                    <span className={`badge badge-${exp.status}`} style={{ gap: '6px' }}>
                                        {exp.status === 'approved' ? <CheckCircle2 size={14}/> : exp.status === 'rejected' ? <XCircle size={14}/> : <Clock size={14}/>}
                                        {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ maxWidth: '300px' }}>
                                    {exp.status !== 'pending' && exp.ExpenseApprovals?.length > 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            <Info size={14} color="var(--primary)"/>
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.ExpenseApprovals[0].comment}</span>
                                        </div>
                                    ) : <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {viewDetails && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }} onClick={() => setViewDetails(null)}>
                    <div className="card" style={{ width: '90%', maxWidth: '600px', padding: '32px', background: 'white', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewDetails(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={24} color="var(--primary)" /> Claim Details
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Amount</p>
                                <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{viewDetails.amount_in_base_currency} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>USD</span></p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Status</p>
                                <span className={`badge badge-${viewDetails.status}`} style={{ marginTop: '4px', display: 'inline-flex' }}>
                                    {viewDetails.status.charAt(0).toUpperCase() + viewDetails.status.slice(1)}
                                </span>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Description & Note</p>
                                <p style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{viewDetails.description || 'No description provided.'}</p>
                            </div>
                            
                            {viewDetails.ExpenseApprovals?.length > 0 && (
                                <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Manager Feedback</p>
                                    <div style={{ fontSize: '15px', color: '#b45309', marginTop: '4px', background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span>{viewDetails.ExpenseApprovals[0].comment}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {viewDetails.receipt_url && (
                             <div style={{ marginTop: '24px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={`http://localhost:5000/${viewDetails.receipt_url.replace(/\\/g, '/')}`} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '40vh', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.parentElement.innerHTML = 'Image Not Found'; }} />
                             </div>
                        )}
                    </div>
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Create Expense Claim</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input type="number" step="0.01" placeholder="Amount" onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                                <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                             </div>
                             <select onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="Meals">Meals</option>
                                <option value="Travel">Travel</option>
                                <option value="Supplies">Supplies</option>
                             </select>
                             <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                             <textarea placeholder="Description" rows="3" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                             
                             <div style={{ border: '2px dashed #e2e8f0', padding: '24px', textAlign: 'center', borderRadius: '12px', background: '#f8fafc' }}>
                                <input type="file" id="receipt" accept="image/png, image/jpeg, image/jpg" onChange={e => setFile(e.target.files[0])} hidden />
                                <label htmlFor="receipt" style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}>
                                    <ImageIcon size={32} style={{ marginBottom: '8px', margin: '0 auto' }} />
                                    <p>{file ? file.name : 'Click to Upload Receipt (OCR Enabled)'}</p>
                                </label>
                             </div>

                             <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Submit Request</button>
                             </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
