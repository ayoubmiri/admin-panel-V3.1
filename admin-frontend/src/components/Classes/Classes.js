import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getClasses, deleteClass } from '../../services/classService';
import { getFilieres } from '../../services/filiereService';
import Pagination from '../Common/Pagination';

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesData, filieresData] = await Promise.all([
          getClasses((currentPage - 1) * limit, limit, '', searchTerm),
          getFilieres(),
        ]);
        setClasses(classesData.classes);
        setTotalItems(classesData.total);
        setFilieres(filieresData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch classes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const handleDelete = async (filiereId, code) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(filiereId, code);
        setClasses(classes.filter(cls => !(cls.filiere_id === filiereId && cls.code === code)));
      } catch (error) {
        console.error('Error deleting class:', error);
        setError('Failed to delete class. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getFiliereName = (filiereId) => {
    const filiere = filieres.find(f => f.id === filiereId);
    return filiere ? filiere.name : 'Not assigned';
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Class Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search classes..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>
          <Link
            to="/classes/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Class
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filiere</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={`${cls.filiere_id}_${cls.code}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cls.name || 'Unnamed'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cls.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getFiliereName(cls.filiere_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cls.academic_year || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cls.semester || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/classes/${cls.filiere_id}/${cls.code}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        <FaEye />
                      </Link>
                      <Link to={`/classes/edit/${cls.filiere_id}/${cls.code}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(cls.filiere_id, cls.code)}
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
          <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-sm text-gray-500 mb-2 md:mb-0">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} classes
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / limit)}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Class;










// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { getClasses, deleteClass } from '../../services/classService';
// import { getFilieres } from '../../services/filiereService';
// import Pagination from '../Common/Pagination';

// const Class = () => {
//   const [classes, setClasses] = useState([]);
//   const [filieres, setFilieres] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [classesData, filieresData] = await Promise.all([
//           getClasses((currentPage - 1) * limit, limit, '', searchTerm),
//           getFilieres(),
//         ]);
//         setClasses(classesData.classes);
//         setTotalItems(classesData.total);
//         setFilieres(filieresData);
//         setError(null);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to fetch classes. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, searchTerm]);

//   const handleDelete = async (filiereId, code) => {
//     if (window.confirm('Are you sure you want to delete this class?')) {
//       try {
//         await deleteClass(filiereId, code);
//         setClasses(classes.filter(cls => !(cls.filiere_id === filiereId && cls.code === code)));
//       } catch (error) {
//         console.error('Error deleting class:', error);
//         setError('Failed to delete class. Please try again.');
//       }
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const getFiliereName = (filiereId) => {
//     const filiere = filieres.find(f => f.id === filiereId);
//     return filiere ? filiere.name : 'Not assigned';
//   };

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
//         <h2 className="font-semibold text-lg mb-2 md:mb-0">Class Management</h2>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search classes..."
//                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
//           </form>
//           <Link
//             to="/classes/new"
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
//           >
//             <FaPlus className="mr-2" /> Add Class
//           </Link>
//         </div>
//       </div>

//       {loading ? (
//         <div className="p-8 text-center">Loading...</div>
//       ) : error ? (
//         <div className="p-8 text-center text-red-500">{error}</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filiere</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {classes.map((cls) => (
//                   <tr key={`${cls.filiere_id}_${cls.code}`}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{cls.name || 'Unnamed'}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {cls.code}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {getFiliereName(cls.filiere_id)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <Link to={`/classes/${cls.filiere_id}/${cls.code}`} className="text-blue-600 hover:text-blue-900 mr-3">
//                         <FaEye />
//                       </Link>
//                       <Link to={`/classes/edit/${cls.filiere_id}/${cls.code}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
//                         <FaEdit />
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(cls.filiere_id, cls.code)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
//             <div className="text-sm text-gray-500 mb-2 md:mb-0">
//               Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} classes
//             </div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={Math.ceil(totalItems / limit)}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Class;