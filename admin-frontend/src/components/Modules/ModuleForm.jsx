import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getModuleById, createModule, updateModule } from '../../services/moduleService';
import { getFilieres } from '../../services/filiereService';

const ModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    filiere_id: '',
    semester: '1',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filieresData = await getFilieres();
        setFilieres(Array.isArray(filieresData) ? filieresData : []);
        
        if (id) {
          const moduleData = await getModuleById(id);
          setFormData({
            code: moduleData.code || '',
            name: moduleData.name || '',
            filiere_id: moduleData.filiere_id || '',
            semester: moduleData.semester || '1',
            status: moduleData.status || 'active'
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
      [name]: value
    });
    setMessage({ text: '', type: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Code requis';
    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.filiere_id) newErrors.filiere_id = 'Filière requise';
    
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
        filiere_id: formData.filiere_id || null
      };
      console.log('Submitting payload:', payload);
      if (id) {
        await updateModule(id, payload);
        setMessage({ text: 'Module mis à jour avec succès !', type: 'success' });
      } else {
        await createModule(payload);
        setMessage({ text: 'Module créé avec succès !', type: 'success' });
        setFormData({
          code: '',
          name: '',
          filiere_id: '',
          semester: '1',
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Error saving module:', error);
      let errorMessage = 'Échec de l’enregistrement du module. Veuillez vérifier vos données et réessayer.';
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
        <h2 className="font-semibold text-lg">{id ? 'Modifier Module' : 'Ajouter Nouveau Module'}</h2>
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
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filiere_id">
                Filière
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.filiere_id ? 'border-red-500' : ''}`}
                id="filiere_id"
                name="filiere_id"
                value={formData.filiere_id}
                onChange={handleChange}
              >
                <option value="">Sélectionner une filière</option>
                {filieres.map((filiere) => (
                  <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
                ))}
              </select>
              {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                Semestre
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="1">Semestre 1</option>
                <option value="2">Semestre 2</option>
                <option value="3">Semestre 3</option>
                <option value="4">Semestre 4</option>
                <option value="5">Semestre 5</option>
                <option value="6">Semestre 6</option>
              </select>
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
              onClick={() => navigate('/modules')}
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

export default ModuleForm;














// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getModuleById, createModule, updateModule } from '../../services/moduleService';
// import { getFilieres } from '../../services/filiereService';

// const ModuleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [filieres, setFilieres] = useState([]);
//   const [formData, setFormData] = useState({
//     code: '',
//     name: '',
//     filiere_id: '',
//     semester: '1',
//     status: 'active'
//   });
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState({ text: '', type: '' }); // Success or failure message

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const filieresData = await getFilieres();
//         setFilieres(Array.isArray(filieresData) ? filieresData : []);
        
//         if (id) {
//           const moduleData = await getModuleById(id);
//           setFormData({
//             code: moduleData.code || '',
//             name: moduleData.name || '',
//             filiere_id: moduleData.filiere_id || '',
//             semester: moduleData.semester || '1',
//             status: moduleData.status || 'active'
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
//       [name]: value
//     });
//     // Clear message on form change
//     setMessage({ text: '', type: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.code.trim()) newErrors.code = 'Code is required';
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
    
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
//         filiere_id: formData.filiere_id || null
//       };
//       console.log('Submitting payload:', payload);
//       if (id) {
//         await updateModule(id, payload);
//         setMessage({ text: 'Module updated successfully!', type: 'success' });
//       } else {
//         await createModule(payload);
//         setMessage({ text: 'Module created successfully!', type: 'success' });
//         // Reset form after creation
//         setFormData({
//           code: '',
//           name: '',
//           filiere_id: '',
//           semester: '1',
//           status: 'active'
//         });
//       }
//     } catch (error) {
//       console.error('Error saving module:', error);
//       let errorMessage = 'Failed to save module. Please check your input and try again.';
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
//         <h2 className="font-semibold text-lg">{id ? 'Edit Module' : 'Add New Module'}</h2>
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
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filiere_id">
//                 Filiere
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.filiere_id ? 'border-red-500' : ''}`}
//                 id="filiere_id"
//                 name="filiere_id"
//                 value={formData.filiere_id}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Filiere</option>
//                 {filieres.map((filiere) => (
//                   <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
//                 ))}
//               </select>
//               {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
//                 Semester
//               </label>
//               <select
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="semester"
//                 name="semester"
//                 value={formData.semester}
//                 onChange={handleChange}
//               >
//                 <option value="1">Semester 1</option>
//                 <option value="2">Semester 2</option>
//                 <option value="3">Semester 3</option>
//                 <option value="4">Semester 4</option>
//                 <option value="5">Semester 5</option>
//                 <option value="6">Semester 6</option>
//               </select>
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
//               onClick={() => navigate('/modules')}
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

// export default ModuleForm;












// // // src/components/Module/ModuleForm.jsx
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { getModuleById, createModule, updateModule } from '../../services/moduleService';
// // import { getFilieres } from '../../services/filiereService';

// // const ModuleForm = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [filieres, setFilieres] = useState([]);
// //   const [formData, setFormData] = useState({
// //     code: '',
// //     name: '',
// //     filiere_id: '',
// //     semester: '1',
// //     status: 'active'
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [errors, setErrors] = useState({});

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const filieresData = await getFilieres();
// //         setFilieres(filieresData);
        
// //         if (id) {
// //           const moduleData = await getModuleById(id);
// //           setFormData({
// //             code: moduleData.code,
// //             name: moduleData.name,
// //             filiere_id: moduleData.filiere_id,
// //             semester: moduleData.semester,
// //             status: moduleData.status
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
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
// //       [name]: value
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     // Basic validation
// //     const newErrors = {};
// //     if (!formData.code) newErrors.code = 'Code is required';
// //     if (!formData.name) newErrors.name = 'Name is required';
// //     if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
    
// //     setErrors(newErrors);
// //     if (Object.keys(newErrors).length > 0) return;
    
// //     try {
// //       setLoading(true);
// //       if (id) {
// //         await updateModule(id, formData);
// //       } else {
// //         await createModule(formData);
// //       }
// //       navigate('/modules');
// //     } catch (error) {
// //       console.error('Error saving module:', error);
// //       setErrors({ submit: 'Failed to save module. Please try again.' });
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
// //         <h2 className="font-semibold text-lg">{id ? 'Edit Module' : 'Add New Module'}</h2>
// //       </div>
      
// //       <div className="p-6">
// //         {errors.submit && (
// //           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
// //             {errors.submit}
// //           </div>
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
            
// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filiere_id">
// //                 Filiere
// //               </label>
// //               <select
// //                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.filiere_id ? 'border-red-500' : ''}`}
// //                 id="filiere_id"
// //                 name="filiere_id"
// //                 value={formData.filiere_id}
// //                 onChange={handleChange}
// //               >
// //                 <option value="">Select Filiere</option>
// //                 {filieres.map((filiere) => (
// //                   <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
// //                 ))}
// //               </select>
// //               {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
// //             </div>
            
// //             <div>
// //               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
// //                 Semester
// //               </label>
// //               <select
// //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                 id="semester"
// //                 name="semester"
// //                 value={formData.semester}
// //                 onChange={handleChange}
// //               >
// //                 <option value="1">Semester 1</option>
// //                 <option value="2">Semester 2</option>
// //                 <option value="3">Semester 3</option>
// //                 <option value="4">Semester 4</option>
// //                 <option value="5">Semester 5</option>
// //                 <option value="6">Semester 6</option>
// //               </select>
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
// //               onClick={() => navigate('/modules')}
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

// // export default ModuleForm;