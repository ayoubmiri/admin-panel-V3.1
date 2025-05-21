// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBell,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaBullhorn,
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaCog
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Adjust this path if needed

const Layout = ({ children }) => {
  const { logout } = useAuth(); // Get logout from your auth context

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const handleLogout = () => {
    logout(); // Calls your auth context logout function
  };

  const navItems = [
    { icon: <FaTachometerAlt />, text: 'Dashboard', path: '/' },
    { icon: <FaUsers />, text: 'Students', path: '/students' },
    { icon: <FaChalkboardTeacher />, text: 'Teachers', path: '/teachers' },
    { icon: <FaBullhorn />, text: 'Announcements', path: '/announcements' },
    { icon: <FaBook />, text: 'Courses', path: '/courses' },
    { icon: <FaCalendarAlt />, text: 'Schedule', path: '/schedule' },
    { icon: <FaFileAlt />, text: 'Grades', path: '/grades' },
    { icon: <FaCog />, text: 'Settings', path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`sidebar bg-white shadow-lg ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-blue-800">Admin Panel</h1>}
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            {sidebarCollapsed ? '>' : '<'}
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="mr-3">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.text}</span>}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 mt-6 focus:outline-none"
          >
            <FaSignOutAlt className="mr-3" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleMobileSidebar} className="md:hidden text-gray-500">
              ☰
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700" aria-label="Notifications">
                <span className="relative">
                  <FaBell />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              </button>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/40" alt="User" className="h-8 w-8 rounded-full mr-2" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
