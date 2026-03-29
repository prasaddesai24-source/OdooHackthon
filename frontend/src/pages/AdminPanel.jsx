import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Plus, Users, ShieldCheck, ChevronRight, DownloadCloud } from 'lucide-react';

const AdminPanel = () => {
    const [rule, setRule] = useState({ type: 'percentage', threshold_percentage: 60, is_manager_approver: true });
    const [steps, setSteps] = useState([]);
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        fetchSettings();
        fetchManagers();
    }, []);

    const fetchSettings = async () => {
        setSteps([
            { step_number: 1, approver_name: 'Bob Manager', role_target: 'manager' }
        ]);
    };

    const fetchManagers = async () => {
        const res = await axios.get('http://localhost:5000/api/users/managers');
        if (res.data.success) setManagers(res.data.managers);
    };

    const handleExport = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expenses');
            if (res.data.success) {
                const data = res.data.expenses;
                let csv = 'Expense ID,Employee Name,Date,Amount (Base USD),Category,AI Risk Rating,Status,Manager Feedback\n';
                data.forEach(exp => {
                    const employee = exp.User?.name || 'Unknown';
                    const feedback = exp.ExpenseApprovals?.length > 0 ? exp.ExpenseApprovals[0].comment.replace(/,/g, ' ') : '';
                    const safeDesc = exp.description ? exp.description.replace(/,/g, ' ') : '';
                    const risk = exp.risk_level?.toUpperCase() || 'LOW';
                    csv += `${exp.id},${employee},${exp.date},${exp.amount_in_base_currency},${exp.category},${risk},${exp.status},${feedback}\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', `Zenith_Expense_Audit_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (err) {
            alert('Failed to generate export file. Ensure you are authorized.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Company Settings & Workflow</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure how expense approvals are routed across the company.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Approval Strategy Policy */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#eff6ff', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={20}/>
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Approval Policy</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Rule Logic</label>
                            <select value={rule.type} onChange={e => setRule({ ...rule, type: e.target.value })} style={{ width: '100%', padding: '10px' }}>
                                <option value="percentage">Dynamic (Reporting Manager First)</option>
                                <option value="specific">Specific Approver (CFO)</option>
                            </select>
                        </div>

                        <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Auto-Route to Managers</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automatically send requests to the employee's designated manager.</p>
                            </div>
                            <input type="checkbox" checked={rule.is_manager_approver} onChange={e => setRule({ ...rule, is_manager_approver: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>Save Policy Configuration</button>
                    </div>
                </div>

                {/* Sequence Overview */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#ecfdf5', color: 'var(--success)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ChevronRight size={20}/>
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Active Workflow Path</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: 'var(--text-main)' }}>1</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', fontSize: '14px' }}>Direct Reporting Manager</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>As assigned in the Team Management page (e.g. Yash)</p>
                            </div>
                        </div>
                        
                        <div style={{ padding: '16px', border: '1px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', cursor: 'pointer', background: '#f8fafc' }}>
                            <Plus size={16}/>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>Add Secondary Approver (e.g. Admin)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#fef3c7', color: '#d97706', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20}/>
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Team Directory & Logs</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Use the Users tab on the left sidebar to explicitly link an Employee to their Reporting Manager so the workflow can assign expenses correctly.</p>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn btn-primary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DownloadCloud size={18}/> Export CSV Audit Logs
                    </button>
                    <button className="btn btn-outline" style={{ background: 'white' }}>Manage Employees</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
