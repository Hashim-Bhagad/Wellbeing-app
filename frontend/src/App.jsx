import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ReportDetails from './pages/ReportDetails';
import BMICalculator from './pages/BMICalculator';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Layout always present */}
          <Route element={<Layout />}>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadReport />} />
              <Route path="/reports" element={<Dashboard />} />
              <Route path="/reports/:id" element={<ReportDetails />} />
              <Route path="/bmi" element={<BMICalculator />} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
