import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import FamilyTrees from './pages/FamilyTrees';
import Kuldevi from './pages/Kuldevi';
import CommonTree from './pages/CommonTree';
import Approvals from './pages/Approvals';
import PaymentSettings from './pages/PaymentSettings';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <Users />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <Layout>
                <UserDetail />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/family-trees"
          element={
            <PrivateRoute>
              <Layout>
                <FamilyTrees />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuldevi"
          element={
            <PrivateRoute>
              <Layout>
                <Kuldevi />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/common-tree"
          element={
            <PrivateRoute>
              <Layout>
                <CommonTree />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/approvals"
          element={
            <PrivateRoute>
              <Layout>
                <Approvals />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <PaymentSettings />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
