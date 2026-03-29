import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Expenses from './pages/Expenses';
import Approvals from './pages/Approvals';
import AdminPanel from './pages/AdminPanel';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

const DashboardLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <div className="container">
        {children}
      </div>
    </main>
  </div>
);

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <DashboardLayout><Dashboard /></DashboardLayout> : <Navigate to="/login" />} />
      <Route path="/expenses" element={user ? <DashboardLayout><Expenses /></DashboardLayout> : <Navigate to="/login" />} />
      <Route path="/approvals" element={user ? <DashboardLayout><Approvals /></DashboardLayout> : <Navigate to="/login" />} />
      <Route path="/users" element={user?.role === 'admin' ? <DashboardLayout><Users /></DashboardLayout> : <Navigate to="/login" />} />
      <Route path="/settings" element={user?.role === 'admin' ? <DashboardLayout><AdminPanel /></DashboardLayout> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
