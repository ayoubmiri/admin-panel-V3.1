// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getFiliereById, createFiliere, updateFiliere } from '../../services/filiereService';
// import { getTeachers } from '../../services/teacherService';

// const FiliereForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [teachers, setTeachers] = useState([]);
//   const [formData, setFormData] = useState({
//     code: '',
//     name: '',
//     description: '',
//     duration: '',
//     coordinator_id: '',
//     status: 'active',
//   });
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState({ text: '', type: '' }); // Success or failure message

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const teachersData = await getTeachers();
//         console.log('Teachers response:', teachersData);
//         const validTeachers = Array.isArray(teachersData)
//           ? teachersData.filter(teacher => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teacher.id))
//           : [];
//         setTeachers(validTeachers);

//         if (id) {
//           const filiereData = await getFiliereById(id);
//           setFormData({
//             code: filiereData.code || '',
//             name: filiereData.name || '',
//             description: filiereData.description || '',
//             duration: filiereData.duration || '',
//             coordinator_id: filiereData.coordinator_id || '',
//             status: filiereData.status || 'active',
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
//     if (!formData.code.trim()) newErrors.code = 'Code is required';
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
//     if (formData.coordinator_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.coordinator_id))
//       newErrors.coordinator_id = 'Coordinator ID must be a valid UUID';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const payload = {
//         ...formData,
//         coordinator_id: formData.coordinator_id || null,
//       };
//       console.log('Submitting payload:', payload);
//       if (id) {
//         await updateFiliere(id, payload);
//         setMessage({ text: 'Filiere updated successfully!', type: 'success' });
//       } else {
//         await createFiliere(payload);
//         setMessage({ text: 'Filiere created successfully!', type: 'success' });
//         // Reset form after creation
//         setFormData({
//           code: '',
//           name: '',
//           description: '',
//           duration: '',
//           coordinator_id: '',
//           status: 'active',
//         });
//       }
//     } catch (error) {
//       console.error('Error saving filiere:', error);
//       let errorMessage = 'Failed to save filiere. Please check your input and try again.';
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
//         <h2 className="font-semibold text-lg">{id ? 'Edit Filiere' : 'Add New Filiere'}</h2>
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
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
//                 Duration
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.duration ? 'border-red-500' : ''}`}
//                 id="duration"
//                 name="duration"
//                 type="text"
//                 value={formData.duration}
//                 onChange={handleChange}
//               />
//               {errors.duration && <p className="text-red-500 text-xs italic">{errors.duration}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coordinator_id">
//                 Coordinator
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.coordinator_id ? 'border-red-500' : ''}`}
//                 id="coordinator_id"
//                 name="coordinator_id"
//                 value={formData.coordinator_id}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Coordinator</option>
//                 {teachers.map((teacher, index) => (
//                   <option key={teacher.id || index} value={teacher.id}>
//                     {teacher.first_name && teacher.last_name
//                       ? `${teacher.first_name} ${teacher.last_name}`
//                       : teacher.name || 'Unnamed Teacher'}
//                   </option>
//                 ))}
//               </select>
//               {errors.coordinator_id && <p className="text-red-500 text-xs italic">{errors.coordinator_id}</p>}
//               {teachers.length === 0 && (
//                 <p className="text-yellow-500 text-xs italic">No teachers available. Please add teachers first.</p>
//               )}
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
//               onClick={() => navigate('/filieres')}
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

// export default FiliereForm;








// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { getFiliereById, createFiliere, updateFiliere } from '../../services/filiereService';
// // import { getTeachers } from '../../services/teacherService';

// // const FiliereForm = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [teachers, setTeachers] = useState([]);
// //   const [formData, setFormData] = useState({
// //     code: '',
// //     name: '',
// //     description: '',
// //     duration: '',
// //     coordinator_id: '',
// //     status: 'active',
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [errors, setErrors] = useState({});

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const teachersData = await getTeachers();
// //         console.log('Teachers response:', teachersData);
// //         const validTeachers = Array.isArray(teachersData)
// //           ? teachersData.filter(teacher => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teacher.id))
// //           : [];
// //         setTeachers(validTeachers);

// //         if (id) {
// //           const filiereData = await getFiliereById(id);
// //           setFormData({
// //             code: filiereData.code || '',
// //             name: filiereData.name || '',
// //             description: filiereData.description || '',
// //             duration: filiereData.duration || '',
// //             coordinator_id: filiereData.coordinator_id || '',
// //             status: filiereData.status || 'active',
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
// //     if (!formData.code.trim()) newErrors.code = 'Code is required';
// //     if (!formData.name.trim()) newErrors.name = 'Name is required';
// //     if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
// //     if (formData.coordinator_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.coordinator_id))
// //       newErrors.coordinator_id = 'Coordinator ID must be a valid UUID';

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);
// //       const payload = {
// //         ...formData,
// //         coordinator_id: formData.coordinator_id || null,
// //       };
// //       console.log('Submitting payload:', payload);
// //       if (id) {
// //         await updateFiliere(id, payload);
// //       } else {
// //         await createFiliere(payload);
// //       }
// //       navigate('/filieres');
// //     } catch (error) {
// //       console.error('Error saving filiere:', error);
// //       let errorMessage = 'Failed to save filiere. Please check your input and try again.';
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
// //         <h2 className="font-semibold text-lg">{id ? 'Edit Filiere' : 'Add New Filiere'}</h2>
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

// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
// //                 Duration
// //               </label>
// //               <input
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.duration ? 'border-red-500' : ''}`}
// //                 id="duration"
// //                 name="duration"
// //                 type="text"
// //                 value={formData.duration}
// //                 onChange={handleChange}
// //               />
// //               {errors.duration && <p className="text-red-500 text-xs italic">{errors.duration}</p>}
// //             </div>

// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coordinator_id">
// //                 Coordinator
// //               </label>
// //               <select
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.coordinator_id ? 'border-red-500' : ''}`}
// //                 id="coordinator_id"
// //                 name="coordinator_id"
// //                 value={formData.coordinator_id}
// //                 onChange={handleChange}
// //               >
// //                 <option value="">Select Coordinator</option>
// //                 {teachers.map((teacher, index) => (
// //                   <option key={teacher.id || index} value={teacher.id}>
// //                     {teacher.first_name && teacher.last_name
// //                       ? `${teacher.first_name} ${teacher.last_name}`
// //                       : teacher.name || 'Unnamed Teacher'}
// //                   </option>
// //                 ))}
// //               </select>
// //               {errors.coordinator_id && <p className="text-red-500 text-xs italic">{errors.coordinator_id}</p>}
// //               {teachers.length === 0 && (
// //                 <p className="text-yellow-500 text-xs italic">No teachers available. Please add teachers first.</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
// //                 Status
// //               </label>
// //               <select
// //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                 id="status"
// //                 name="status"
// //                 value={formData.status}
// //                 onChange={handleChange}
// //               >
// //                 <option value="active">Active</option>
// //                 <option value="inactive">Inactive</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="mt-6 flex justify-end">
// //             <button
// //               type="button"
// //               onClick={() => navigate('/filieres')}
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

// // export default FiliereForm;






import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFiliereById, createFiliere, updateFiliere } from '../../services/filiereService';
import { getTeachers } from '../../services/teacherService';

const FiliereForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    duration: '',
    coordinator_id: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getTeachers();
        console.log('Teachers response:', teachersData);
        const validTeachers = Array.isArray(teachersData)
          ? teachersData.filter(teacher => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teacher.id))
          : [];
        setTeachers(validTeachers);

        if (id) {
          const filiereData = await getFiliereById(id);
          setFormData({
            code: filiereData.code || '',
            name: filiereData.name || '',
            description: filiereData.description || '',
            duration: filiereData.duration || '',
            coordinator_id: filiereData.coordinator_id || '',
            status: filiereData.status || 'active',
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
    if (!formData.code.trim()) newErrors.code = 'Code requis';
    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.duration.trim()) newErrors.duration = 'Durée requise';
    if (formData.coordinator_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.coordinator_id))
      newErrors.coordinator_id = 'L’identifiant du coordinateur doit être un UUID valide';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        coordinator_id: formData.coordinator_id || null,
      };
      console.log('Submitting payload:', payload);
      if (id) {
        await updateFiliere(id, payload);
        setMessage({ text: 'Filière mise à jour avec succès !', type: 'success' });
      } else {
        await createFiliere(payload);
        setMessage({ text: 'Filière créée avec succès !', type: 'success' });
        setFormData({
          code: '',
          name: '',
          description: '',
          duration: '',
          coordinator_id: '',
          status: 'active',
        });
      }
    } catch (error) {
      console.error('Error saving filiere:', error);
      let errorMessage = 'Échec de l’enregistrement de la filière. Veuillez vérifier vos données et réessayer.';
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
        <h2 className="font-semibold text-lg">{id ? 'Modifier Filière' : 'Ajouter Nouvelle Filière'}</h2>
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
              <label className="block text-gray-7

00 text-sm font-bold mb-2" htmlFor="description">
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

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                Durée
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.duration ? 'border-red-500' : ''}`}
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
              />
              {errors.duration && <p className="text-red-500 text-xs italic">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coordinator_id">
                Coordinateur
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.coordinator_id ? 'border-red-500' : ''}`}
                id="coordinator_id"
                name="coordinator_id"
                value={formData.coordinator_id}
                onChange={handleChange}
              >
                <option value="">Sélectionner un coordinateur</option>
                {teachers.map((teacher, index) => (
                  <option key={teacher.id || index} value={teacher.id}>
                    {teacher.first_name && teacher.last_name
                      ? `${teacher.first_name} ${teacher.last_name}`
                      : teacher.name || 'Enseignant sans nom'}
                  </option>
                ))}
              </select>
              {errors.coordinator_id && <p className="text-red-500 text-xs italic">{errors.coordinator_id}</p>}
              {teachers.length === 0 && (
                <p className="text-yellow-500 text-xs italic">Aucun enseignant disponible. Veuillez d’abord ajouter des enseignants.</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Statut
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/filieres')}
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

export default FiliereForm;