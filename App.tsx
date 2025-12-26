
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import NoteEditorPage from './pages/NoteEditorPage';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import StudyBuddy from './pages/StudyBuddy';
import CareerAdvisor from './pages/CareerAdvisor';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><i className="fa-solid fa-spinner animate-spin text-4xl text-indigo-600"></i></div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><i className="fa-solid fa-spinner animate-spin text-4xl text-indigo-600"></i></div>;
  
  const isAdmin = user?.email?.endsWith('@nexushub.admin') || user?.email === 'nexus-admin@example.com' || (user?.user_metadata?.role === 'admin');
  
  if (!user || !isAdmin) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/study-buddy" element={<ProtectedRoute><Layout><StudyBuddy /></Layout></ProtectedRoute>} />
      <Route path="/career-advisor" element={<ProtectedRoute><Layout><CareerAdvisor /></Layout></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><Layout><NoteEditorPage /></Layout></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><Layout><NoteEditorPage /></Layout></ProtectedRoute>} />
      <Route path="/note/:id" element={<ProtectedRoute><Layout><NoteDetail /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
