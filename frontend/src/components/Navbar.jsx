import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, LogOut, MessageSquare, FileText, Pill, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">MED<span className="text-primary">AI</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/chat" 
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/chat') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageSquare size={18} />
              Symptom Chat
            </Link>
            <Link 
              to="/reports" 
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/reports') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
            >
              <FileText size={18} />
              Report Analyzer
            </Link>
            <Link 
              to="/medicine" 
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/medicine') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
            >
              <Pill size={18} />
              Medicine Info
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/history') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
            >
              <History size={18} />
              History
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-border hover:bg-gray-800 text-white p-2.5 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                Doctor Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
