import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ title, openMobileSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
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
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </a>
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </a>
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;