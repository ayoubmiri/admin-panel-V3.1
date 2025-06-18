import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    teacher_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const teacherResponse = await api.get(`/teachers/${id}`);
          const teacherData = teacherResponse.data;
          setFormData({
            teacher_id: teacherData.teacher_id || id,
            first_name: teacherData.first_name || '',
            last_name: teacherData.last_name || '',
            email: teacherData.email || '',
            phone: teacherData.phone || '',
            specialization: teacherData.specialization || '',
            status: teacherData.status || 'active',
          });
        }
      } catch (error) {
        console.error('Failed to fetch teacher:', error);
        setErrors({ fetch: 'Échec du chargement des données de l’enseignant. Veuillez réessayer.' });
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
    if (!formData.teacher_id.trim()) newErrors.teacher_id = 'Identifiant enseignant requis';
    if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d’email invalide';
    if (!formData.specialization.trim()) newErrors.specialization = 'Spécialisation requise';
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Numéro de téléphone invalide';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      teacher_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialization: '',
      status: 'active',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      if (id) {
        await api.put(`/teachers/${id}`, formData);
        setMessage({ text: 'Enseignant mis à jour avec succès !', type: 'success' });
      } else {
        await api.post('/teachers', formData);
        setMessage({ text: 'Enseignant créé avec succès !', type: 'success' });
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save teacher:', error);
      let errorMessage = 'Échec de l’enregistrement de l’enseignant. Veuillez vérifier vos données et réessayer.';
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

  if (loading) return <div className="text-center py-8 text-gray-600">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-gray-800">{id ? 'Modifier Enseignant' : 'Ajouter Nouvel Enseignant'}</h2>
      </div>

      <div className="p-6">
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        {errors.fetch && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
            {errors.fetch}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacher_id">
                Identifiant Enseignant
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.teacher_id ? 'border-red-500' : ''}`}
                id="teacher_id"
                name="teacher_id"
                type="text"
                value={formData.teacher_id}
                onChange={handleChange}
                disabled={!!id}
              />
              {errors.teacher_id && <p className="text-red-500 text-xs italic">{errors.teacher_id}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                Prénom
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.first_name ? 'border-red-500' : ''}`}
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <p className="text-red-500 text-xs italic">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                Nom
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.last_name ? 'border-red-500' : ''}`}
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <p className="text-red-500 text-xs italic">{errors.last_name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Téléphone
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''}`}
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">
                Spécialisation
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.specialization ? 'border-red-500' : ''}`}
                id="specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
              />
              {errors.specialization && <p className="text-red-500 text-xs italic">{errors.specialization}</p>}
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
                <option value="on_leave">En congé</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/teachers')}
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

export default TeacherForm;












// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../../services/api'; // Import the configured Axios instance
// import { v4 as uuidv4 } from 'uuid'; // For generating teacher_id

// const TeacherForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState(''); // New state for success message
//   const [formData, setFormData] = useState({
//     teacher_id: '',
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     specialization: '',
//     status: 'active',
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (id) {
//           // Fetch teacher by ID
//           const teacherResponse = await api.get(`/teachers/${id}`);
//           const teacherData = teacherResponse.data;
//           setFormData({
//             teacher_id: teacherData.teacher_id || id,
//             first_name: teacherData.first_name || '',
//             last_name: teacherData.last_name || '',
//             email: teacherData.email || '',
//             phone: teacherData.phone || '',
//             specialization: teacherData.specialization || '',
//             status: teacherData.status || 'active',
//           });
//         } else {
//           // Generate teacher_id for new teacher
//           setFormData(prev => ({ ...prev, teacher_id: '' }));
//         }
//       } catch (error) {
//         console.error('Failed to fetch teacher:', error);
//         setErrors({ fetch: 'Failed to load teacher data. Please try again.' });
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
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
//     if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
//     if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
//     if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
//     if (!formData.teacher_id.trim()) newErrors.teacher_id = 'Teacher ID is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const resetForm = () => {
//     setFormData({
//       teacher_id: '',// uuidv4(), // Generate new teacher_id
//       first_name: '',
//       last_name: '',
//       email: '',
//       phone: '',
//       specialization: '',
//       status: 'active',
//     });
//     setErrors({});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       setSuccessMessage(''); // Clear previous success message
//       if (id) {
//         // Update teacher
//         await api.put(`/teachers/${id}`, formData);
//         setSuccessMessage('Teacher updated successfully!');
//       } else {
//         // Create teacher
//         await api.post('/teachers', formData);
//         setSuccessMessage('Teacher created successfully!');
//         resetForm(); // Reset form for new teacher
//       }
//     } catch (error) {
//       console.error('Failed to save teacher:', error);
//       if (error.response && error.response.status === 422) {
//         const validationErrors = error.response.data.detail.reduce((acc, err) => {
//           const field = err.loc[err.loc.length - 1];
//           acc[field] = err.msg;
//           return acc;
//         }, {});
//         setErrors(validationErrors);
//       } else {
//         setErrors({ submit: 'Failed to save teacher. Please try again.' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;

//   return (
//     <div className="bg-white rounded-lg shadow mb-6">
//       <div className="p-4 border-b">
//         <h2 className="font-semibold text-lg text-gray-800">{id ? 'Edit Teacher' : 'Add New Teacher'}</h2>
//       </div>

//       <div className="p-6">
//         {successMessage && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
//             {successMessage}
//           </div>
//         )}
//         {errors.submit && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//             {errors.submit}
//           </div>
//         )}
//         {errors.fetch && (
//           <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
//             {errors.fetch}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacher_id">
//                 Teacher ID
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.teacher_id ? 'border-red-500' : ''}`}
//                 id="teacher_id"
//                 name="teacher_id"
//                 type="text"
//                 value={formData.teacher_id}
//                 onChange={handleChange}
//                 disabled={!!id} // Disable for edits
//               />
//               {errors.teacher_id && <p className="text-red-500 text-xs italic">{errors.teacher_id}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
//                 First Name
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.first_name ? 'border-red-500' : ''}`}
//                 id="first_name"
//                 name="first_name"
//                 type="text"
//                 value={formData.first_name}
//                 onChange={handleChange}
//               />
//               {errors.first_name && <p className="text-red-500 text-xs italic">{errors.first_name}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
//                 Last Name
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.last_name ? 'border-red-500' : ''}`}
//                 id="last_name"
//                 name="last_name"
//                 type="text"
//                 value={formData.last_name}
//                 onChange={handleChange}
//               />
//               {errors.last_name && <p className="text-red-500 text-xs italic">{errors.last_name}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
//                 Phone
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''}`}
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//               {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">
//                 Specialization
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.specialization ? 'border-red-500' : ''}`}
//                 id="specialization"
//                 name="specialization"
//                 type="text"
//                 value={formData.specialization}
//                 onChange={handleChange}
//               />
//               {errors.specialization && <p className="text-red-500 text-xs italic">{errors.specialization}</p>}
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
//                 <option value="on_leave">On Leave</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate('/teachers')}
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

// export default TeacherForm;

