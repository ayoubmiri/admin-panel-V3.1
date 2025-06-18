// // src/components/Teachers/Teachers.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { getTeachers } from '../../services/teacherService';

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const data = await getTeachers(searchTerm);
//         setTeachers(data);
//       } catch (error) {
//         console.error('Error fetching teachers:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeachers();
//   }, [searchTerm]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Search is handled automatically by the useEffect
//   };

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
//         <h2 className="font-semibold text-lg mb-2 md:mb-0">Teacher Management</h2>
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search teachers..."
//               className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//           <Link
//             to="/teachers/new"
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
//           >
//             <FaPlus className="mr-2" /> Add Teacher
//           </Link>
//         </form>
//       </div>

//       {loading ? (
//         <div className="p-8 text-center">Loading teachers...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {teachers.map((teacher) => (
//                 <tr key={teacher.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img className="h-10 w-10 rounded-full" src={teacher.avatar || 'https://i.pravatar.cc/150?img=3'} alt="" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.specialization}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {teacher.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <Link to={`/teachers/${teacher.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
//                       <FaEye />
//                     </Link>
//                     <Link to={`/teachers/edit/${teacher.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
//                       <FaEdit />
//                     </Link>
//                     <button className="text-red-600 hover:text-red-900">
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Teachers;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getTeachers, deleteTeacher } from '../../services/teacherService';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers(searchTerm);
        setTeachers(data.data || data); // Handle paginated or direct array response
        setError(null);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Failed to load teachers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [searchTerm]);

  const handleDelete = async (id, teacherName) => {
    if (!window.confirm(`Are you sure you want to delete ${teacherName}?`)) {
      return;
    }

    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setError('Failed to delete teacher. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically by the useEffect
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Teacher Management</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/teachers/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Teacher
          </Link>
        </form>
      </div>

      {error && (
        <div className="p-4 text-red-600 text-center">{error}</div>
      )}

      {loading ? (
        <div className="p-8 text-center">Loading teachers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={teacher.avatar || 'https://i.pravatar.cc/150?img=3'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/teachers/${teacher.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEye />
                    </Link>
                    <Link to={`/teachers/edit/${teacher.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => handleDelete(teacher.id, teacher.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Teachers;