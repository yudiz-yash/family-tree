import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import PaymentQR from './pages/PaymentQR';
import Dashboard from './pages/Dashboard';
import FamilyTreeBuilder from './pages/FamilyTreeBuilder';
import EditProfile from './pages/EditProfile';
import MaintenancePage from './pages/MaintenancePage';
import { LanguageProvider } from './context/LanguageContext';
import api from './api/axios';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(null);

  useEffect(() => {
    api.get('/api/settings')
      .then(res => setMaintenanceMode(res.data.maintenanceMode ?? false))
      .catch(() => setMaintenanceMode(false));
  }, []);

  if (maintenanceMode === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4a2d8a 50%, #6C3FC5 100%)',
      }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.3)', borderTopColor: '#F4C430', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <LanguageProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute>
              <CompleteProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentQR />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute onlyApproved>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/family-tree"
          element={
            <PrivateRoute onlyApproved>
              <FamilyTreeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute onlyApproved>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
