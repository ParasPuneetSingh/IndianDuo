import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Gem, Flame, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇮🇳</span>
            </div>
            <span className="text-xl font-bold text-gray-900">IndianDuo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                  Dashboard
                </Link>
                <Link to="/learn" className="text-gray-700 hover:text-primary-600 font-medium">
                  Learn
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* User Stats & Profile */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              {/* Streak */}
              <div className="flex items-center space-x-1 text-orange-500">
                <Flame className="w-5 h-5 streak-fire" />
                <span className="font-semibold">{user.current_streak}</span>
              </div>

              {/* Hearts */}
              <div className="flex items-center space-x-1">
                <Heart className="w-5 h-5 heart-icon" />
                <span className="font-semibold text-red-500">{user.hearts}</span>
              </div>

              {/* Gems */}
              <div className="flex items-center space-x-1">
                <Gem className="w-5 h-5 gem-icon" />
                <span className="font-semibold text-cyan-500">{user.gems}</span>
              </div>

              {/* XP */}
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {user.total_xp} XP
              </div>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;