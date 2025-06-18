import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

const Element = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        // Fetch elements, modules, and teachers
        const [elementsResponse, modulesResponse, teachersResponse] = await Promise.all([
          api.get(`/elements${searchTerm ? `?search=${searchTerm}` : ''}`),
          api.get('/modules'),
          api.get('/teachers'),
        ]);

        const elementsData = elementsResponse.data;
        const modules = modulesResponse.data;
        const teachers = teachersResponse.data;

        // Create module and teacher ID-to-name maps
        const moduleMap = modules.reduce((acc, m) => {
          acc[m.id] = m.name;
          return acc;
        }, {});
        const teacherMap = teachers.reduce((acc, t) => {
          acc[t.id] = t.name;
          return acc;
        }, {});

        // Map elements with module and teacher names
        const mappedElements = elementsData.map(element => ({
          id: element.id,
          code: element.code,
          name: element.name,
          module: { name: moduleMap[element.module_id] || 'Not assigned' },
          teacher: { name: teacherMap[element.teacher_id] || 'Not assigned' },
          credits: element.credits,
        }));

        setElements(mappedElements);
      } catch (error) {
        console.error('Error fetching elements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Element Management</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search elements..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/elements/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Element
          </Link>
        </form>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading elements...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {elements.map((element) => (
                <tr key={element.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{element.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{element.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {element.module.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {element.teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {element.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/elements/${element.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEye />
                    </Link>
                    <Link to={`/elements/edit/${element.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
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

export default Element;






// // src/components/Element/Element.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { getElements } from '../../services/elementService';

// const Element = () => {
//   const [elements, setElements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchElements = async () => {
//       try {
//         const data = await getElements(searchTerm);
//         setElements(data);
//       } catch (error) {
//         console.error('Error fetching elements:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchElements();
//   }, [searchTerm]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
//         <h2 className="font-semibold text-lg mb-2 md:mb-0">Element Management</h2>
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search elements..."
//               className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//           <Link
//             to="/elements/new"
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
//           >
//             <FaPlus className="mr-2" /> Add Element
//           </Link>
//         </form>
//       </div>

//       {loading ? (
//         <div className="p-8 text-center">Loading elements...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {elements.map((element) => (
//                 <tr key={element.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{element.code}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{element.name}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {element.module?.name || 'Not assigned'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {element.teacher?.name || 'Not assigned'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {element.credits}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <Link to={`/elements/${element.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
//                       <FaEye />
//                     </Link>
//                     <Link to={`/elements/edit/${element.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
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

// export default Element;