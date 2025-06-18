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
  const [message, setMessage] = useState({ text: '', type: '' });

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
        setErrors({ fetch: 'Échec du chargement des données. Veuillez réessayer.' });
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
    setMessage({ text: '', type: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.module_id) newErrors.module_id = 'Module requis';
    else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.module_id))
      newErrors.module_id = 'L’identifiant du module doit être un UUID valide';
    if (!formData.code.trim()) newErrors.code = 'Code requis';
    if (!formData.name.trim()) newErrors.name = 'Nom requis';

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
        setMessage({ text: 'Élément mis à jour avec succès !', type: 'success' });
      } else {
        await createElement(payload);
        setMessage({ text: 'Élément créé avec succès !', type: 'success' });
        setFormData({
          module_id: '',
          code: '',
          name: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error saving element:', error);
      let errorMessage = 'Échec de l’enregistrement de l’élément. Veuillez vérifier vos données et réessayer.';
      if (error.response?.status === 422 && error.response.data?.detail) {
        const details = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : error.response.data.detail;
        errorMessage = `Erreurs de validation : ${details}`;
      }
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Modifier Élément' : 'Ajouter Nouvel Élément'}</h2>
      </div>

      <div className="p-6">
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
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
                <option value="">Sélectionner un module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name || module.code || 'Module sans nom'}
                  </option>
                ))}
              </select>
              {errors.module_id && <p className="text-red-500 text-xs italic">{errors.module_id}</p>}
              {modules.length === 0 && (
                <p className="text-yellow-500 text-xs italic">Aucun module disponible. Veuillez d’abord ajouter des modules.</p>
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
                Nom
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
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElementForm;












// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getElementById, createElement, updateElement } from '../../services/elementService';
// import { getModules } from '../../services/moduleService';

// const ElementForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [modules, setModules] = useState([]);
//   const [formData, setFormData] = useState({
//     module_id: '',
//     code: '',
//     name: '',
//     description: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState({ text: '', type: '' }); // Success or failure message

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const modulesData = await getModules();
//         console.log('Modules response:', modulesData);
//         const validModules = Array.isArray(modulesData)
//           ? modulesData.filter(module => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(module.id))
//           : [];
//         setModules(validModules);

//         if (id) {
//           const elementData = await getElementById(id);
//           setFormData({
//             module_id: elementData.module_id || '',
//             code: elementData.code || '',
//             name: elementData.name || '',
//             description: elementData.description || '',
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setErrors({ fetch: 'Failed to load data. Please try again.' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Clear message on form change
//     setMessage({ text: '', type: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.module_id) newErrors.module_id = 'Module is required';
//     else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.module_id))
//       newErrors.module_id = 'Module ID must be a valid UUID';
//     if (!formData.code.trim()) newErrors.code = 'Code is required';
//     if (!formData.name.trim()) newErrors.name = 'Name is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const payload = { ...formData };
//       console.log('Submitting payload:', payload);
//       if (id) {
//         await updateElement(id, payload);
//         setMessage({ text: 'Element updated successfully!', type: 'success' });
//       } else {
//         await createElement(payload);
//         setMessage({ text: 'Element created successfully!', type: 'success' });
//         // Reset form after creation
//         setFormData({
//           module_id: '',
//           code: '',
//           name: '',
//           description: '',
//         });
//       }
//     } catch (error) {
//       console.error('Error saving element:', error);
//       let errorMessage = 'Failed to save element. Please check your input and try again.';
//       if (error.response?.status === 422 && error.response.data?.detail) {
//         const details = Array.isArray(error.response.data.detail)
//           ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
//           : error.response.data.detail;
//         errorMessage = `Validation errors: ${details}`;
//       }
//       setMessage({ text: errorMessage, type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b">
//         <h2 className="font-semibold text-lg">{id ? 'Edit Element' : 'Add New Element'}</h2>
//       </div>

//       <div className="p-6">
//         {message.text && (
//           <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {message.text}
//           </div>
//         )}
//         {errors.fetch && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module_id">
//                 Module
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.module_id ? 'border-red-500' : ''}`}
//                 id="module_id"
//                 name="module_id"
//                 value={formData.module_id}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Module</option>
//                 {modules.map((module) => (
//                   <option key={module.id} value={module.id}>
//                     {module.name || module.code || 'Unnamed Module'}
//                   </option>
//                 ))}
//               </select>
//               {errors.module_id && <p className="text-red-500 text-xs italic">{errors.module_id}</p>}
//               {modules.length === 0 && (
//                 <p className="text-yellow-500 text-xs italic">No modules available. Please add modules first.</p>
//               )}
//             </div>

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
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate('/elements')}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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








// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { getElementById, createElement, updateElement } from '../../services/elementService';
// // import { getModules } from '../../services/moduleService';

// // const ElementForm = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [modules, setModules] = useState([]);
// //   const [formData, setFormData] = useState({
// //     module_id: '',
// //     code: '',
// //     name: '',
// //     description: '',
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [errors, setErrors] = useState({});

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const modulesData = await getModules();
// //         console.log('Modules response:', modulesData);
// //         const validModules = Array.isArray(modulesData)
// //           ? modulesData.filter(module => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(module.id))
// //           : [];
// //         setModules(validModules);

// //         if (id) {
// //           const elementData = await getElementById(id);
// //           setFormData({
// //             module_id: elementData.module_id || '',
// //             code: elementData.code || '',
// //             name: elementData.name || '',
// //             description: elementData.description || '',
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         setErrors({ fetch: 'Failed to load data. Please try again.' });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [id]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
// //     if (!formData.module_id) newErrors.module_id = 'Module is required';
// //     else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.module_id))
// //       newErrors.module_id = 'Module ID must be a valid UUID';
// //     if (!formData.code.trim()) newErrors.code = 'Code is required';
// //     if (!formData.name.trim()) newErrors.name = 'Name is required';

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);
// //       const payload = { ...formData };
// //       console.log('Submitting payload:', payload);
// //       if (id) {
// //         await updateElement(id, payload);
// //       } else {
// //         await createElement(payload);
// //       }
// //       navigate('/elements');
// //     } catch (error) {
// //       console.error('Error saving element:', error);
// //       let errorMessage = 'Failed to save element. Please check your input and try again.';
// //       if (error.response?.status === 422 && error.response.data?.detail) {
// //         const details = Array.isArray(error.response.data.detail)
// //           ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
// //           : error.response.data.detail;
// //         errorMessage = `Validation errors: ${details}`;
// //       }
// //       setErrors({ submit: errorMessage });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return <div className="p-8 text-center">Loading...</div>;
// //   }

// //   return (
// //     <div className="bg-white rounded-lg shadow mb-6">
// //       <div className="p-4 border-b">
// //         <h2 className="font-semibold text-lg">{id ? 'Edit Element' : 'Add New Element'}</h2>
// //       </div>

// //       <div className="p-6">
// //         {errors.submit && (
// //           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>
// //         )}
// //         {errors.fetch && (
// //           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
// //         )}

// //         <form onSubmit={handleSubmit}>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module_id">
// //                 Module
// //               </label>
// //               <select
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.module_id ? 'border-red-500' : ''}`}
// //                 id="module_id"
// //                 name="module_id"
// //                 value={formData.module_id}
// //                 onChange={handleChange}
// //               >
// //                 <option value="">Select Module</option>
// //                 {modules.map((module) => (
// //                   <option key={module.id} value={module.id}>
// //                     {module.name || module.code || 'Unnamed Module'}
// //                   </option>
// //                 ))}
// //               </select>
// //               {errors.module_id && <p className="text-red-500 text-xs italic">{errors.module_id}</p>}
// //               {modules.length === 0 && (
// //                 <p className="text-yellow-500 text-xs italic">No modules available. Please add modules first.</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
// //                 Code
// //               </label>
// //               <input
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.code ? 'border-red-500' : ''}`}
// //                 id="code"
// //                 name="code"
// //                 type="text"
// //                 value={formData.code}
// //                 onChange={handleChange}
// //               />
// //               {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
// //             </div>

// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
// //                 Name
// //               </label>
// //               <input
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
// //                 id="name"
// //                 name="name"
// //                 type="text"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //               />
// //               {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
// //             </div>

// //             <div className="md:col-span-2">
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
// //                 Description
// //               </label>
// //               <textarea
// //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                 id="description"
// //                 name="description"
// //                 rows="3"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //               />
// //             </div>
// //           </div>

// //           <div className="mt-6 flex justify-end">
// //             <button
// //               type="button"
// //               onClick={() => navigate('/elements')}
// //               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //               disabled={loading}
// //             >
// //               {loading ? 'Saving...' : 'Save'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ElementForm;
