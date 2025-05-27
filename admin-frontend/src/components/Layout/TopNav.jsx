import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import context

const TopNav = ({ title, openMobileSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth(); // Use context logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Already handles navigate to /login
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button 
            onClick={openMobileSidebar} 
            className="text-gray-500 mr-4 md:hidden"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <button className="relative text-gray-500 hover:text-gray-700">
            <i className="fas fa-bell"></i>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Visible Logout button */}
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

          {/* Dropdown User Menu */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)} 
              className="flex items-center text-gray-700"
            >
              <img src="/avatar.png" alt="User" className="h-8 w-8 rounded-full mr-2" />
              <span className="hidden md:inline">Admin User</span>
              <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
