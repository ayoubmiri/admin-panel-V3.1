// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getElementById, createElement, updateElement } from '../../services/elementService';
// import { getModules } from '../../services/moduleService';
// import { getTeachers } from '../../services/teacherService';

// const ElementForm = () => {
//   const { id, moduleId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [modules, setModules] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [formData, setFormData] = useState({
//     code: '',
//     name: '',
//     description: '',
//     moduleId: moduleId || '',
//     teacherId: '',
//     coefficient: 1,
//     credit: 1,
//     status: 'active'
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [modulesData, teachersData] = await Promise.all([
//           getModules(),
//           getTeachers()
//         ]);
        
//         setModules(modulesData);
//         setTeachers(teachersData);
        
//         if (id) {
//           const elementData = await getElementById(id);
//           setFormData({
//             code: elementData.code,
//             name: elementData.name,
//             description: elementData.description,
//             moduleId: elementData.moduleId,
//             teacherId: elementData.teacherId,
//             coefficient: elementData.coefficient,
//             credit: elementData.credit,
//             status: elementData.status
//           });
//         } else if (moduleId) {
//           setFormData(prev => ({ ...prev, moduleId }));
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, [id, moduleId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.code.trim()) newErrors.code = 'Code is required';
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.moduleId) newErrors.moduleId = 'Module is required';
//     if (!formData.teacherId) newErrors.teacherId = 'Teacher is required';
//     if (formData.coefficient <= 0) newErrors.coefficient = 'Coefficient must be positive';
//     if (formData.credit <= 0) newErrors.credit = 'Credit must be positive';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     try {
//       setLoading(true);
//       if (id) {
//         await updateElement(id, formData);
//       } else {
//         await createElement(formData);
//       }
//       navigate(moduleId ? `/modules/${moduleId}/elements` : '/elements');
//     } catch (error) {
//       console.error(error);
//       setErrors({ submit: 'Failed to save element. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b">
//         <h2 className="font-semibold text-lg">{id ? 'Edit Element' : 'Add New Element'}</h2>
//       </div>
      
//       <div className="p-6">
//         {errors.submit && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//             {errors.submit}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
//                 Code
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.code ? 'border-red-500' : ''}`}
//                 id="code"
//                 name="code"
//                 type="text"
//                 value={formData.code}
//                 onChange={handleChange}
//               />
//               {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                 Name
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
//             </div>
            
//             <div className="md:col-span-2">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//                 Description
//               </label>
//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="description"
//                 name="description"
//                 rows="3"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moduleId">
//                 Module
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.moduleId ? 'border-red-500' : ''}`}
//                 id="moduleId"
//                 name="moduleId"
//                 value={formData.moduleId}
//                 onChange={handleChange}
//                 disabled={!!moduleId}
//               >
//                 <option value="">Select Module</option>
//                 {modules.map((module) => (
//                   <option key={module.id} value={module.id}>{module.name}</option>
//                 ))}
//               </select>
//               {errors.moduleId && <p className="text-red-500 text-xs italic">{errors.moduleId}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacherId">
//                 Teacher
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.teacherId ? 'border-red-500' : ''}`}
//                 id="teacherId"
//                 name="teacherId"
//                 value={formData.teacherId}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Teacher</option>
//                 {teachers.map((teacher) => (
//                   <option key={teacher.id} value={teacher.id}>
//                     {teacher.firstName} {teacher.lastName}
//                   </option>
//                 ))}
//               </select>
//               {errors.teacherId && <p className="text-red-500 text-xs italic">{errors.teacherId}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coefficient">
//                 Coefficient
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.coefficient ? 'border-red-500' : ''}`}
//                 id="coefficient"
//                 name="coefficient"
//                 type="number"
//                 min="1"
//                 value={formData.coefficient}
//                 onChange={handleChange}
//               />
//               {errors.coefficient && <p className="text-red-500 text-xs italic">{errors.coefficient}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credit">
//                 Credit
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.credit ? 'border-red-500' : ''}`}
//                 id="credit"
//                 name="credit"
//                 type="number"
//                 min="1"
//                 value={formData.credit}
//                 onChange={handleChange}
//               />
//               {errors.credit && <p className="text-red-500 text-xs italic">{errors.credit}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
//                 Status
//               </label>
//               <select
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="mt-6 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate(moduleId ? `/modules/${moduleId}/elements` : '/elements')}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-est-blue text-white rounded-md hover:bg-blue-700"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ElementForm;






import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getElementById, createElement, updateElement } from '../../services/elementService';
import { getModules } from '../../services/moduleService';

const ElementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    module_id: '',
    code: '',
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesData = await getModules();
        console.log('Modules response:', modulesData);
        const validModules = Array.isArray(modulesData)
          ? modulesData.filter(module => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(module.id))
          : [];
        setModules(validModules);

        if (id) {
          const elementData = await getElementById(id);
          setFormData({
            module_id: elementData.module_id || '',
            code: elementData.code || '',
            name: elementData.name || '',
            description: elementData.description || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ fetch: 'Failed to load data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.module_id) newErrors.module_id = 'Module is required';
    else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.module_id))
      newErrors.module_id = 'Module ID must be a valid UUID';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = { ...formData };
      console.log('Submitting payload:', payload);
      if (id) {
        await updateElement(id, payload);
      } else {
        await createElement(payload);
      }
      navigate('/elements');
    } catch (error) {
      console.error('Error saving element:', error);
      let errorMessage = 'Failed to save element. Please check your input and try again.';
      if (error.response?.status === 422 && error.response.data?.detail) {
        const details = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : error.response.data.detail;
        errorMessage = `Validation errors: ${details}`;
      }
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Element' : 'Add New Element'}</h2>
      </div>

      <div className="p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>
        )}
        {errors.fetch && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module_id">
                Module
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.module_id ? 'border-red-500' : ''}`}
                id="module_id"
                name="module_id"
                value={formData.module_id}
                onChange={handleChange}
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name || module.code || 'Unnamed Module'}
                  </option>
                ))}
              </select>
              {errors.module_id && <p className="text-red-500 text-xs italic">{errors.module_id}</p>}
              {modules.length === 0 && (
                <p className="text-yellow-500 text-xs italic">No modules available. Please add modules first.</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Code
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.code ? 'border-red-500' : ''}`}
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/elements')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElementForm;
