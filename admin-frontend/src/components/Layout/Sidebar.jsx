import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ sidebarCollapsed, toggleSidebar, closeMobileSidebar }) => {
  const navItems = [
    { icon: 'fa-tachometer-alt', text: 'Dashboard', path: '/' },
    { icon: 'fa-users', text: 'Students', path: '/students' },
    { icon: 'fa-chalkboard-teacher', text: 'Teachers', path: '/teachers' },
    { icon: 'fa-bullhorn', text: 'Announcements', path: '/announcements' },
    { icon: 'fa-book', text: 'Courses', path: '/courses' },
    { icon: 'fa-calendar-alt', text: 'Schedule', path: '/schedule' },
    { icon: 'fa-file-alt', text: 'Grades', path: '/grades' },
    { icon: 'fa-cog', text: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <div className={`sidebar bg-white shadow-lg w-64 fixed md:relative h-full z-20 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo EST" className="h-8 mr-2" />
            <span className="logo-text font-bold text-est-blue">EST Admin</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-gray-700 hidden md:block"
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
          <button 
            onClick={closeMobileSidebar} 
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <img src="/avatar.png" alt="Admin" className="h-10 w-10 rounded-full mr-3" />
            <div className="nav-text">
              <h4 className="font-semibold">Admin User</h4>
              <p className="text-gray-500 text-sm">Administrator</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive ? 
                    'active-nav text-est-blue' : 
                    'text-gray-700 hover:bg-gray-100'}`
                }
                onClick={closeMobileSidebar}
              >
                <i className={`fas ${item.icon} mr-3 text-gray-500`}></i>
                <span className="nav-text">{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;