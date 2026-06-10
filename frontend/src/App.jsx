import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SymptomChat from './pages/SymptomChat';
import ReportAnalyzer from './pages/ReportAnalyzer';
import MedicineLookup from './pages/MedicineLookup';
import SymptomHistory from './pages/SymptomHistory';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<SymptomChat />} />
              <Route path="/reports" element={<ReportAnalyzer />} />
              <Route path="/medicine" element={<MedicineLookup />} />
              <Route path="/history" element={<SymptomHistory />} />
              <Route path="/login" element={<DoctorLogin />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
