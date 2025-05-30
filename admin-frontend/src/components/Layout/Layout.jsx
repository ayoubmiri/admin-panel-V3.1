import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaLayerGroup,
  FaCube,
  FaPuzzlePiece,
  FaUsersCog,
  FaTasks
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { icon: <FaTachometerAlt />, text: 'Dashboard', path: '/' },
    { icon: <FaUsers />, text: 'Students', path: '/students' },
    { icon: <FaChalkboardTeacher />, text: 'Teachers', path: '/teachers' },
    { icon: <FaLayerGroup />, text: 'Filieres', path: '/filieres' },
    { icon: <FaCube />, text: 'Modules', path: '/modules' },
    { icon: <FaPuzzlePiece />, text: 'Elements', path: '/elements' },
    { icon: <FaUsersCog />, text: 'Classes', path: '/classes' },
    { icon: <FaTasks />, text: 'Assignments', path: '/assignments' },
    { icon: <FaFileAlt />, text: 'Exams', path: '/exams' },
    { icon: <FaBullhorn />, text: 'Announcements', path: '/announcements' },
    { icon: <FaCalendarAlt />, text: 'Schedule', path: '/schedule' },
    { icon: <FaBook />, text: 'Grades', path: '/grades' },
    { icon: <FaCog />, text: 'Settings', path: '/settings' }
  ];

  // Determine active tab based on current route
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed md:static z-30 sidebar bg-white shadow-lg 
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-all duration-300 ease-in-out
          h-full
        `}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <img src="https://via.placeholder.com/40" alt="Logo" className="h-8 mr-2" />
              <span className="font-bold text-blue-800">EST Admin</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-gray-700 hidden md:block"
          >
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
          <button 
            onClick={closeMobileSidebar} 
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <FaChevronLeft />
          </button>
        </div>
        
        <div className="p-4">
          <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img 
              src={currentUser?.avatar || 'https://i.pravatar.cc/40'} 
              alt="Admin" 
              className="h-10 w-10 rounded-full mr-3" 
            />
            {!sidebarCollapsed && (
              <div>
                <h4 className="font-semibold">{currentUser?.name || 'Admin User'}</h4>
                <p className="text-gray-500 text-sm">Administrator</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const itemPath = item.path.split('/')[1] || 'dashboard';
              const isActive = activeTab === itemPath;
              
              return (
                <Link 
                  key={index} 
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`
                    flex items-center p-3 rounded-lg 
                    ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.text}</span>
                  )}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center p-3 rounded-lg 
                text-gray-700 hover:bg-gray-100 mt-6 focus:outline-none
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <FaSignOutAlt className="text-gray-500" />
              {!sidebarCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16">
          <div className="flex items-center justify-between p-4 h-full">
            <div className="flex items-center">
              <button 
                onClick={toggleMobileSidebar} 
                className="text-gray-500 mr-4 md:hidden"
              >
                <FaBars />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab.replace('-', ' ') || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative" aria-label="Notifications">
                <FaBell />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="flex items-center">
                <img 
                  src={currentUser?.avatar || 'https://i.pravatar.cc/40'} 
                  alt="User" 
                  className="h-8 w-8 rounded-full mr-2" 
                />
                {!sidebarCollapsed && (
                  <span>{currentUser?.name || 'Admin'}</span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;






// import React, { useState } from 'react';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import {
//   FaBell,
//   FaSignOutAlt,
//   FaTachometerAlt,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaBullhorn,
//   FaBook,
//   FaCalendarAlt,
//   FaFileAlt,
//   FaCog,
//   FaChevronLeft,
//   FaChevronRight,
//   FaBars
// } from 'react-icons/fa';
// import { useAuth } from '../../contexts/AuthContext';

// const Layout = () => {
//   const { logout, currentUser } = useAuth();
//   const location = useLocation();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//   const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
//   const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
//   const closeMobileSidebar = () => setMobileSidebarOpen(false);

//   const handleLogout = () => {
//     logout();
//   };

//   const navItems = [
//     { icon: <FaTachometerAlt />, text: 'Dashboard', path: '/dashboard' },
//     { icon: <FaUsers />, text: 'Students', path: '/students' },
//     { icon: <FaChalkboardTeacher />, text: 'Teachers', path: '/teachers' },
//     { icon: <FaBullhorn />, text: 'Announcements', path: '/announcements' },
//     { icon: <FaBook />, text: 'Courses', path: '/courses' },
//     { icon: <FaCalendarAlt />, text: 'Schedule', path: '/schedule' },
//     { icon: <FaFileAlt />, text: 'Grades', path: '/grades' },
//     { icon: <FaCog />, text: 'Settings', path: '/settings' }
//   ];

//   // Determine active tab based on current route
//   const activeTab = location.pathname.split('/')[1] || 'dashboard';

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Mobile Overlay */}
//       {mobileSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div 
//         className={`
//           fixed md:static z-30 sidebar bg-white shadow-lg 
//           ${sidebarCollapsed ? 'w-20' : 'w-64'} 
//           ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//           transition-all duration-300 ease-in-out
//           h-full
//         `}
//       >
//         <div className="flex items-center justify-between p-4 border-b h-16">
//           {!sidebarCollapsed && (
//             <div className="flex items-center">
//               <img src="https://via.placeholder.com/40" alt="Logo" className="h-8 mr-2" />
//               <span className="font-bold text-blue-800">EST Admin</span>
//             </div>
//           )}
//           <button 
//             onClick={toggleSidebar} 
//             className="text-gray-500 hover:text-gray-700 hidden md:block"
//           >
//             {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
//           </button>
//           <button 
//             onClick={closeMobileSidebar} 
//             className="text-gray-500 hover:text-gray-700 md:hidden"
//           >
//             <FaChevronLeft />
//           </button>
//         </div>
        
//         <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
//           {navItems.map((item, index) => {
//             const itemPath = item.path.split('/')[1] || 'dashboard';
//             const isActive = activeTab === itemPath;
            
//             return (
//               <Link 
//                 key={index} 
//                 to={item.path}
//                 onClick={closeMobileSidebar}
//                 className={`
//                   flex items-center p-3 rounded-lg 
//                   ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}
//                 `}
//               >
//                 <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
//                   {item.icon}
//                 </span>
//                 {!sidebarCollapsed && (
//                   <span className="ml-3">{item.text}</span>
//                 )}
//               </Link>
//             );
//           })}

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className={`
//               w-full flex items-center p-3 rounded-lg 
//               text-gray-700 hover:bg-gray-100 mt-6 focus:outline-none
//             `}
//           >
//             <FaSignOutAlt className="text-gray-500" />
//             {!sidebarCollapsed && <span className="ml-3">Logout</span>}
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Navigation */}
//         <header className="bg-white shadow-sm h-16">
//           <div className="flex items-center justify-between p-4 h-full">
//             <div className="flex items-center">
//               <button 
//                 onClick={toggleMobileSidebar} 
//                 className="text-gray-500 mr-4 md:hidden"
//               >
//                 <FaBars />
//               </button>
//               <h1 className="text-xl font-semibold text-gray-800 capitalize">
//                 {activeTab || 'Dashboard'}
//               </h1>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <button className="text-gray-500 hover:text-gray-700 relative" aria-label="Notifications">
//                 <FaBell />
//                 <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
//               </button>
              
//               <div className="flex items-center">
//                 <img 
//                   src={currentUser?.avatar || 'https://i.pravatar.cc/40'} 
//                   alt="User" 
//                   className="h-8 w-8 rounded-full mr-2" 
//                 />
//                 {!sidebarCollapsed && (
//                   <span>{currentUser?.name || 'Admin'}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>
        
//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;