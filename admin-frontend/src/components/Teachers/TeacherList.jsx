import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Import the configured Axios instance
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchTeachers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await api.get('/teachers', {
        params: { page, limit: 10, search },
      });
      console.log('API Response:', response.data); // Log response

      let teachersData = [];
      let totalPages = 1;

      if (Array.isArray(response.data)) {
        // Flat list: [{...}, {...}]
        teachersData = response.data;
        // Estimate pagination (assume all teachers returned)
        totalPages = Math.ceil(teachersData.length / 10) || 1;
      } else if (response.data.teachers) {
        // Structured: { teachers: [...], total_pages, current_page }
        teachersData = response.data.teachers;
        totalPages = response.data.total_pages || Math.ceil(response.data.total / 10) || 1;
      } else if (response.data.data) {
        // Alternative: { data: [...], total, page }
        teachersData = response.data.data;
        totalPages = response.data.total_pages || Math.ceil(response.data.total / 10) || 1;
      } else {
        throw new Error('Unexpected API response format');
      }

      // Map backend fields to frontend, ensure unique teacher_id
      const mappedTeachers = teachersData.map((teacher, index) => {
        const teacherId = teacher.teacher_id && teacher.teacher_id !== 'string' ? teacher.teacher_id : `temp-${index}-${Date.now()}`;
        return {
          id: teacherId, // Use unique ID
          teacherId: teacherId,
          firstName: teacher.first_name || 'Unknown',
          lastName: teacher.last_name || 'Unknown',
          email: teacher.email || '',
          specialization: teacher.specialization || 'N/A',
          status: teacher.status || 'active',
          avatar: teacher.avatar || 'https://via.placeholder.com/40',
        };
      });

      console.log('Mapped Teachers:', mappedTeachers); // Log mapped data

      setTeachers(mappedTeachers);
      setTotalPages(totalPages);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch teachers. Please try again.';
      setError(errorMessage);
      console.error('Fetch error:', err, 'Response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`);
        fetchTeachers(currentPage, searchTerm);
      } catch (err) {
        console.error('Delete error:', err, 'Response:', err.response?.data);
        setError('Failed to delete teacher. Please try again.');
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg text-gray-800 mb-2 md:mb-0">Teacher Management</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <SearchBar onSearch={handleSearch} placeholder="Search teachers..." />
          <Link
            to="/teachers/new"
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center justify-center mt-2 sm:mt-0"
          >
            <i className="fas fa-plus mr-2"></i> Add Teacher
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.teacherId}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={teacher.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Prof. {teacher.firstName} {teacher.lastName}</div>
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.specialization}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : teacher.status === 'on_leave'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {teacher.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/teachers/${teacher.id}`} className="text-blue-600 hover:text-blue-800 mr-3">
                    <i className="fas fa-eye"></i>
                  </Link>
                  <Link to={`/teachers/edit/${teacher.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, (currentPage - 1) * 10 + teachers.length)} of {totalPages * 10} teachers
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TeacherList;

















// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api'; // Import the configured Axios instance
// import Pagination from '../../components/Common/Pagination';
// import SearchBar from '../../components/Common/SearchBar';

// const TeacherList = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);

//   const fetchTeachers = async (page = 1, search = '') => {
//     try {
//       setLoading(true);
//       const response = await api.get('/teachers', {
//         params: { page, limit: 10, search },
//       });
//       console.log('API Response:', response.data); // Log response for debugging

//       // Handle different response structures
//       let teachersData = [];
//       let totalPages = 1;
//       let currentPage = page;

//       if (Array.isArray(response.data)) {
//         // Flat list: [{...}, {...}]
//         teachersData = response.data;
//         totalPages = Math.ceil(response.data.length / 10);
//       } else if (response.data.teachers) {
//         // Expected structure: { teachers: [...], total_pages, current_page }
//         teachersData = response.data.teachers;
//         totalPages = response.data.total_pages || Math.ceil(response.data.total / 10);
//         currentPage = response.data.current_page || page;
//       } else if (response.data.data) {
//         // Alternative: { data: [...], total, page }
//         teachersData = response.data.data;
//         totalPages = response.data.total_pages || Math.ceil(response.data.total / 10);
//         currentPage = response.data.page || page;
//       } else {
//         throw new Error('Unexpected API response format');
//       }

//       // Map backend fields to frontend
//       setTeachers(
//         teachersData.map(teacher => ({
//           id: teacher.teacher_id,
//           teacherId: teacher.teacher_id,
//           firstName: teacher.first_name,
//           lastName: teacher.last_name,
//           email: teacher.email,
//           specialization: teacher.specialization,
//           status: teacher.status,
//           avatar: teacher.avatar || 'https://via.placeholder.com/40',
//         }))
//       );
//       setTotalPages(totalPages);
//       setCurrentPage(currentPage);
//       setError(null);
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch teachers. Please try again.';
//       setError(errorMessage);
//       console.error('Fetch error:', err, 'Response:', err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers(currentPage, searchTerm);
//   }, [currentPage, searchTerm]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this teacher?')) {
//       try {
//         await api.delete(`/teachers/${id}`);
//         fetchTeachers(currentPage, searchTerm);
//       } catch (err) {
//         console.error('Delete error:', err, 'Response:', err.response?.data);
//         setError('Failed to delete teacher. Please try again.');
//       }
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
//         <h2 className="font-semibold text-lg text-gray-800 mb-2 md:mb-0">Teacher Management</h2>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//           <SearchBar onSearch={handleSearch} placeholder="Search teachers..." />
//           <Link
//             to="/teachers/new"
//             className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
//           >
//             <i className="fas fa-plus mr-2"></i> Add Teacher
//           </Link>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {teachers.map((teacher) => (
//               <tr key={teacher.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.teacherId}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <img className="h-10 w-10 rounded-full" src={teacher.avatar} alt="" />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">Prof. {teacher.firstName} {teacher.lastName}</div>
//                       <div className="text-sm text-gray-500">{teacher.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.specialization}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       teacher.status === 'active'
//                         ? 'bg-green-100 text-green-800'
//                         : teacher.status === 'on_leave'
//                         ? 'bg-gray-100 text-gray-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {teacher.status.replace('_', ' ')}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <Link to={`/teachers/${teacher.id}`} className="text-blue-600 hover:text-blue-800 mr-3">
//                     <i className="fas fa-eye"></i>
//                   </Link>
//                   <Link to={`/teachers/edit/${teacher.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
//                     <i className="fas fa-edit"></i>
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(teacher.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <i className="fas fa-trash"></i>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
//         <div className="text-sm text-gray-500 mb-2 md:mb-0">
//           Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, (currentPage - 1) * 10 + teachers.length)} of {totalPages * 10} teachers
//         </div>
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default TeacherList;















// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { getTeachers, deleteTeacher } from '../../services/teacherService';
// // import Pagination from '../../components/Common/Pagination';
// // import SearchBar from '../../components/Common/SearchBar';

// // const TeacherList = () => {
// //   const [teachers, setTeachers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [error, setError] = useState(null);

// //   const fetchTeachers = async (page = 1, search = '') => {
// //     try {
// //       setLoading(true);
// //       const data = await getTeachers(page, 10, search);
// //       setTeachers(data.teachers);
// //       setTotalPages(data.totalPages);
// //       setCurrentPage(data.currentPage);
// //       setError(null);
// //     } catch (err) {
// //       setError('Failed to fetch teachers. Please try again.');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTeachers(currentPage, searchTerm);
// //   }, [currentPage, searchTerm]);

// //   const handleDelete = async (id) => {
// //     if (window.confirm('Are you sure you want to delete this teacher?')) {
// //       try {
// //         await deleteTeacher(id);
// //         fetchTeachers(currentPage, searchTerm);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     }
// //   };

// //   const handleSearch = (term) => {
// //     setSearchTerm(term);
// //     setCurrentPage(1);
// //   };

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //   };

// //   if (loading) return <div className="text-center py-8">Loading...</div>;
// //   if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

// //   return (
// //     <div className="bg-white rounded-lg shadow mb-6">
// //       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
// //         <h2 className="font-semibold text-lg mb-2 md:mb-0">Teacher Management</h2>
// //         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
// //           <SearchBar onSearch={handleSearch} placeholder="Search teachers..." />
// //           <Link
// //             to="/teachers/new"
// //             className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
// //           >
// //             <i className="fas fa-plus mr-2"></i> Add Teacher
// //           </Link>
// //         </div>
// //       </div>
      
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {teachers.map((teacher) => (
// //               <tr key={teacher.id}>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.teacherId}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <div className="flex items-center">
// //                     <div className="flex-shrink-0 h-10 w-10">
// //                       <img className="h-10 w-10 rounded-full" src={teacher.avatar || 'https://via.placeholder.com/40'} alt="" />
// //                     </div>
// //                     <div className="ml-4">
// //                       <div className="text-sm font-medium text-gray-900">Prof. {teacher.firstName} {teacher.lastName}</div>
// //                       <div className="text-sm text-gray-500">{teacher.email}</div>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.specialization}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   {teacher.programs.map((program, index) => (
// //                     <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1">
// //                       {program}
// //                     </span>
// //                   ))}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                     teacher.status === 'active' ? 'bg-green-100 text-green-800' : 
// //                     teacher.status === 'on_leave' ? 'bg-gray-100 text-gray-800' : 
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {teacher.status.replace('_', ' ')}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                   <Link to={`/teachers/${teacher.id}`} className="text-est-blue hover:text-blue-700 mr-3">
// //                     <i className="fas fa-eye"></i>
// //                   </Link>
// //                   <Link to={`/teachers/edit/${teacher.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
// //                     <i className="fas fa-edit"></i>
// //                   </Link>
// //                   <button 
// //                     onClick={() => handleDelete(teacher.id)} 
// //                     className="text-red-600 hover:text-red-900"
// //                   >
// //                     <i className="fas fa-trash"></i>
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
      
// //       <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
// //         <div className="text-sm text-gray-500 mb-2 md:mb-0">
// //           Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, teachers.length)} of {totalPages * 10} teachers
// //         </div>
// //         <Pagination 
// //           currentPage={currentPage}
// //           totalPages={totalPages}
// //           onPageChange={handlePageChange}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default TeacherList;