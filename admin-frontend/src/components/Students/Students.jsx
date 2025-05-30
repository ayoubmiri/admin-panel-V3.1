import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getStudents } from '../../services/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents(searchTerm);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Student Management</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/students/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Student
          </Link>
        </form>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading students...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filiere</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.student_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=3" alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.filiere?.name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.year || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 
                      student.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/students/${student.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEye />
                    </Link>
                    <Link to={`/students/edit/${student.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <FaEdit />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
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

export default Students;


// // src/components/Students/Students.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { getStudents } from '../../services/studentService';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const data = await getStudents(searchTerm);
//         setStudents(data);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [searchTerm]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Search is handled automatically by the useEffect
//   };

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
//         <h2 className="font-semibold text-lg mb-2 md:mb-0">Student Management</h2>
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search students..."
//               className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//           <Link
//             to="/students/new"
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
//           >
//             <FaPlus className="mr-2" /> Add Student
//           </Link>
//         </form>
//       </div>

//       {loading ? (
//         <div className="p-8 text-center">Loading students...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {students.map((student) => (
//                 <tr key={student.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img className="h-10 w-10 rounded-full" src={student.avatar || 'https://i.pravatar.cc/150?img=4'} alt="" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                         <div className="text-sm text-gray-500">{student.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.program}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.year}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       student.status === 'active' ? 'bg-green-100 text-green-800' : 
//                       student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {student.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <Link to={`/students/${student.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
//                       <FaEye />
//                     </Link>
//                     <Link to={`/students/edit/${student.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
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

// export default Students;