import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaBullhorn,
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaLayerGroup,
  FaCube,
  FaPuzzlePiece,
  FaUsersCog,
  FaTasks,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Sidebar = ({ sidebarCollapsed, toggleSidebar, closeMobileSidebar, currentUser }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <FaTachometerAlt />, text: 'Tableau de bord', path: '/' },
    { icon: <FaUsers />, text: 'Étudiants', path: '/students' },
    { icon: <FaChalkboardTeacher />, text: 'Enseignants', path: '/teachers' },
    { icon: <FaLayerGroup />, text: 'Filières', path: '/filieres' },
    { icon: <FaCube />, text: 'Modules', path: '/modules' },
    { icon: <FaPuzzlePiece />, text: 'Éléments', path: '/elements' },
    { icon: <FaUsersCog />, text: 'Classes', path: '/classes' },
    { icon: <FaTasks />, text: 'Devoirs', path: '/assignments' },
    { icon: <FaFileAlt />, text: 'Examens', path: '/exams' },
    { icon: <FaBullhorn />, text: 'Annonces', path: '/announcements' },
    { icon: <FaCalendarAlt />, text: 'Emploi du temps', path: '/schedule' },
    { icon: <FaBook />, text: 'Notes', path: '/grades' },
    { icon: <FaCog />, text: 'Paramètres', path: '/settings' }
  ];

  const handleLogout = () => {
    console.log('Déconnexion de l’utilisateur:', currentUser?.name || 'Utilisateur Admin');
    // TODO: Implementer la logique de déconnexion (par exemple, supprimer les tokens d’authentification)
    navigate('/login');
  };

  return (
    <div 
      className={`
        fixed md:static z-30 sidebar bg-white shadow-lg 
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        transition-all duration-300 ease-in-out
        h-screen overflow-y-auto
      `}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        {!sidebarCollapsed && (
          <div className="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Logo" className="h-8 mr-2" />
            <span className="font-bold text-blue-800">Admin EST</span>
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
            alt="Administrateur" 
            className="h-10 w-10 rounded-full mr-3" 
          />
          {!sidebarCollapsed && (
            <div>
              <h4 className="font-semibold">{currentUser?.name || 'Utilisateur Admin'}</h4>
              <p className="text-gray-500 text-sm">Administrateur</p>
            </div>
          )}
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg 
                ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}
                ${sidebarCollapsed ? 'justify-center' : ''}`
              }
              onClick={closeMobileSidebar}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="ml-3">{item.text}</span>
              )}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center p-3 rounded-lg 
              text-gray-700 hover:bg-gray-100 mt-6 focus:outline-none
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <FaSignOutAlt className="text-gray-500" />
            {!sidebarCollapsed && <span className="ml-3">Déconnexion</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;








// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   FaTachometerAlt,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaBullhorn,
//   FaBook,
//   FaCalendarAlt,
//   FaFileAlt,
//   FaCog,
//   FaSignOutAlt,
//   FaLayerGroup,
//   FaCube,
//   FaPuzzlePiece,
//   FaUsersCog,
//   FaTasks
// } from 'react-icons/fa';

// const Sidebar = ({ sidebarCollapsed, toggleSidebar, closeMobileSidebar, currentUser }) => {
//   const navItems = [
//     { icon: <FaTachometerAlt />, text: 'Dashboard', path: '/' },
//     { icon: <FaUsers />, text: 'Students', path: '/students' },
//     { icon: <FaChalkboardTeacher />, text: 'Teachers', path: '/teachers' },
//     { icon: <FaLayerGroup />, text: 'Filieres', path: '/filieres' },
//     { icon: <FaCube />, text: 'Modules', path: '/modules' },
//     { icon: <FaPuzzlePiece />, text: 'Elements', path: '/elements' },
//     { icon: <FaUsersCog />, text: 'Classes', path: '/classes' },
//     { icon: <FaTasks />, text: 'Assignments', path: '/assignments' },
//     { icon: <FaFileAlt />, text: 'Exams', path: '/exams' },
//     { icon: <FaBullhorn />, text: 'Announcements', path: '/announcements' },
//     { icon: <FaCalendarAlt />, text: 'Schedule', path: '/schedule' },
//     { icon: <FaBook />, text: 'Grades', path: '/grades' },
//     { icon: <FaCog />, text: 'Settings', path: '/settings' }
//   ];

//   return (
//     <div 
//       className={`
//         fixed md:static z-30 sidebar bg-white shadow-lg 
//         ${sidebarCollapsed ? 'w-20' : 'w-64'} 
//         transition-all duration-300 ease-in-out
//         h-full
//       `}
//     >
//       <div className="flex items-center justify-between p-4 border-b h-16">
//         {!sidebarCollapsed && (
//           <div className="flex items-center">
//             <img src="https://via.placeholder.com/40" alt="Logo" className="h-8 mr-2" />
//             <span className="font-bold text-blue-800">EST Admin</span>
//           </div>
//         )}
//         <button 
//           onClick={toggleSidebar} 
//           className="text-gray-500 hover:text-gray-700 hidden md:block"
//         >
//           {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
//         </button>
//         <button 
//           onClick={closeMobileSidebar} 
//           className="text-gray-500 hover:text-gray-700 md:hidden"
//         >
//           <FaChevronLeft />
//         </button>
//       </div>
      
//       <div className="p-4">
//         <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : ''}`}>
//           <img 
//             src={currentUser?.avatar || 'https://i.pravatar.cc/40'} 
//             alt="Admin" 
//             className="h-10 w-10 rounded-full mr-3" 
//           />
//           {!sidebarCollapsed && (
//             <div>
//               <h4 className="font-semibold">{currentUser?.name || 'Admin User'}</h4>
//               <p className="text-gray-500 text-sm">Administrator</p>
//             </div>
//           )}
//         </div>
        
//         <nav className="space-y-1">
//           {navItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               className={({ isActive }) => 
//                 `flex items-center p-3 rounded-lg 
//                 ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}
//                 ${sidebarCollapsed ? 'justify-center' : ''}`
//               }
//               onClick={closeMobileSidebar}
//             >
//               <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
//                 {item.icon}
//               </span>
//               {!sidebarCollapsed && (
//                 <span className="ml-3">{item.text}</span>
//               )}
//             </NavLink>
//           ))}

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className={`
//               w-full flex items-center p-3 rounded-lg 
//               text-gray-700 hover:bg-gray-100 mt-6 focus:outline-none
//               ${sidebarCollapsed ? 'justify-center' : ''}
//             `}
//           >
//             <FaSignOutAlt className="text-gray-500" />
//             {!sidebarCollapsed && <span className="ml-3">Logout</span>}
//           </button>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;









// // import React from 'react';
// // import { NavLink } from 'react-router-dom';

// // const Sidebar = ({ sidebarCollapsed, toggleSidebar, closeMobileSidebar }) => {
// //   const navItems = [
// //     { icon: 'fa-tachometer-alt', text: 'Dashboard', path: '/' },
// //     { icon: 'fa-users', text: 'Students', path: '/students' },
// //     { icon: 'fa-chalkboard-teacher', text: 'Teachers', path: '/teachers' },
// //     { icon: 'fa-bullhorn', text: 'Announcements', path: '/announcements' },
// //     { icon: 'fa-book', text: 'Courses', path: '/courses' },
// //     { icon: 'fa-calendar-alt', text: 'Schedule', path: '/schedule' },
// //     { icon: 'fa-file-alt', text: 'Grades', path: '/grades' },
// //     { icon: 'fa-cog', text: 'Settings', path: '/settings' },
// //   ];

// //   return (
// //     <>
// //       <div className={`sidebar bg-white shadow-lg w-64 fixed md:relative h-full z-20 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
// //         <div className="flex items-center justify-between p-4 border-b">
// //           <div className="flex items-center">
// //             <img src="/logo.png" alt="Logo EST" className="h-8 mr-2" />
// //             <span className="logo-text font-bold text-est-blue">EST Admin</span>
// //           </div>
// //           <button 
// //             onClick={toggleSidebar} 
// //             className="text-gray-500 hover:text-gray-700 hidden md:block"
// //           >
// //             <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
// //           </button>
// //           <button 
// //             onClick={closeMobileSidebar} 
// //             className="text-gray-500 hover:text-gray-700 md:hidden"
// //           >
// //             <i className="fas fa-times"></i>
// //           </button>
// //         </div>
        
// //         <div className="p-4">
// //           <div className="flex items-center mb-6">
// //             <img src="/avatar.png" alt="Admin" className="h-10 w-10 rounded-full mr-3" />
// //             <div className="nav-text">
// //               <h4 className="font-semibold">Admin User</h4>
// //               <p className="text-gray-500 text-sm">Administrator</p>
// //             </div>
// //           </div>
          
// //           <nav className="space-y-1">
// //             {navItems.map((item) => (
// //               <NavLink
// //                 key={item.path}
// //                 to={item.path}
// //                 className={({ isActive }) => 
// //                   `flex items-center p-3 rounded-lg ${isActive ? 
// //                     'active-nav text-est-blue' : 
// //                     'text-gray-700 hover:bg-gray-100'}`
// //                 }
// //                 onClick={closeMobileSidebar}
// //               >
// //                 <i className={`fas ${item.icon} mr-3 text-gray-500`}></i>
// //                 <span className="nav-text">{item.text}</span>
// //               </NavLink>
// //             ))}
// //           </nav>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Sidebar;