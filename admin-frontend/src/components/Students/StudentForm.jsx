// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getStudentById, createStudent, updateStudent } from '../../services/studentService';
// import { getFilieres } from '../../services/filiereService';
// import { getClasses } from '../../services/classService';

// const StudentForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [filieres, setFilieres] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [filteredClasses, setFilteredClasses] = useState([]);
//   const [formData, setFormData] = useState({
//     student_id: '',
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     filiere_id: '',
//     class_id: '',
//     student_type: '',
//     year: '',
//     status: 'active',
//     address: '',
//     date_of_birth: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [filieresData, classesData] = await Promise.all([
//           getFilieres(),
//           getClasses(),
//         ]);

//         const filieresArray = Array.isArray(filieresData) ? filieresData : [];
//         const classesArray = Array.isArray(classesData.classes) ? classesData.classes : Array.isArray(classesData) ? classesData : [];

//         // Log to check for duplicates
//         console.log('Filieres:', filieresArray);
//         console.log('Classes:', classesArray);

//         setFilieres(filieresArray);
//         setClasses(classesArray);

//         if (id) {
//           const studentData = await getStudentById(id);
//           setFormData({
//             student_id: studentData.student_id || '',
//             first_name: studentData.first_name || '',
//             last_name: studentData.last_name || '',
//             email: studentData.email || '',
//             phone: studentData.phone || '',
//             filiere_id: studentData.filiere_id || '',
//             class_id: studentData.class_id || '',
//             student_type: studentData.student_type || '',
//             year: studentData.year || '',
//             status: studentData.status || 'active',
//             address: studentData.address || '',
//             date_of_birth: studentData.date_of_birth ? studentData.date_of_birth.split('T')[0] : '',
//           });
//           if (studentData.filiere_id) {
//             const filtered = classesArray.filter(cls => cls.filiere_id === studentData.filiere_id);
//             setFilteredClasses(filtered);
//           }
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

//   useEffect(() => {
//     if (formData.filiere_id) {
//       const filtered = classes.filter(cls => cls.filiere_id === formData.filiere_id);
//       setFilteredClasses(filtered);
//       if (!filtered.some(cls => cls.id === formData.class_id)) {
//         setFormData(prev => ({ ...prev, class_id: '' }));
//       }
//     } else {
//       setFilteredClasses([]);
//       setFormData(prev => ({ ...prev, class_id: '' }));
//     }
//   }, [formData.filiere_id, classes]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
//     if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
//     if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
//     if (!formData.year) newErrors.year = 'Year is required';
//     if (formData.date_of_birth && isNaN(new Date(formData.date_of_birth).getTime()))
//       newErrors.date_of_birth = 'Invalid date of birth';

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
//         date_of_birth: formData.date_of_birth || null,
//         filiere_id: formData.filiere_id || null,
//         class_id: formData.class_id || null,
//       };
//       console.log('Submitting payload:', payload);
//       if (id) {
//         await updateStudent(id, payload);
//       } else {
//         await createStudent(payload);
//       }
//       navigate('/students');
//     } catch (error) {
//       console.error('Error saving student:', error);
//       let errorMessage = 'Failed to save student. Please check your input and try again.';
//       if (error.response?.status === 422 && error.response.data?.detail) {
//         const details = Array.isArray(error.response.data.detail)
//           ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
//           : error.response.data.detail;
//         errorMessage = `Validation errors: ${details}`;
//       }
//       setErrors({ submit: errorMessage });
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
//         <h2 className="font-semibold text-lg">{id ? 'Edit Student' : 'Add New Student'}</h2>
//       </div>

//       <div className="p-6">
//         {errors.submit && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>
//         )}
//         {errors.fetch && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_id">
//                 Student ID
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.student_id ? 'border-red-500' : ''}`}
//                 id="student_id"
//                 name="student_id"
//                 type="text"
//                 value={formData.student_id}
//                 onChange={handleChange}
//               />
//               {errors.student_id && <p className="text-red-500 text-xs italic">{errors.student_id}</p>}
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
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
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
//                 {filieres.map((filiere, index) => (
//                   <option key={filiere.id || index} value={filiere.id}>{filiere.name}</option>
//                 ))}
//               </select>
//               {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class_id">
//                 Class
//               </label>
//               <select
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="class_id"
//                 name="class_id"
//                 value={formData.class_id}
//                 onChange={handleChange}
//                 disabled={!formData.filiere_id}
//               >
//                 <option value="">Select Class</option>
//                 {filteredClasses.map((cls, index) => (
//                   <option key={cls.id || index} value={cls.id}>{cls.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_type">
//                 Student Type
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="student_type"
//                 name="student_type"
//                 type="text"
//                 value={formData.student_type}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
//                 Year
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.year ? 'border-red-500' : ''}`}
//                 id="year"
//                 name="year"
//                 value={formData.year}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Year</option>
//                 <option value="1">First Year</option>
//                 <option value="2">Second Year</option>
//                 <option value="3">Third Year</option>
//               </select>
//               {errors.year && <p className="text-red-500 text-xs italic">{errors.year}</p>}
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
//                 <option value="pending">Pending</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
//                 Date of Birth
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date_of_birth ? 'border-red-500' : ''}`}
//                 id="date_of_birth"
//                 name="date_of_birth"
//                 type="date"
//                 value={formData.date_of_birth}
//                 onChange={handleChange}
//               />
//               {errors.date_of_birth && <p className="text-red-500 text-xs italic">{errors.date_of_birth}</p>}
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
//                 Address
//               </label>
//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="address"
//                 name="address"
//                 rows="3"
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate('/students')}
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

// export default StudentForm;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, createStudent, updateStudent } from '../../services/studentService';
import { getFilieres } from '../../services/filiereService';
import { getClasses } from '../../services/classService';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    filiere_id: '',
    class_id: '',
    student_type: '',
    year: '',
    status: 'active',
    address: '',
    date_of_birth: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filieresData, classesData] = await Promise.all([
          getFilieres(),
          getClasses(),
        ]);

        const filieresArray = Array.isArray(filieresData) ? filieresData : [];
        const classesArray = Array.isArray(classesData.classes) ? classesData.classes : Array.isArray(classesData) ? classesData : [];

        console.log('Filieres:', filieresArray);
        console.log('Classes:', classesArray);

        setFilieres(filieresArray);
        setClasses(classesArray);

        if (id) {
          const studentData = await getStudentById(id);
          setFormData({
            student_id: studentData.student_id || '',
            first_name: studentData.first_name || '',
            last_name: studentData.last_name || '',
            email: studentData.email || '',
            phone: studentData.phone || '',
            filiere_id: studentData.filiere_id || '',
            class_id: studentData.class_id || '',
            student_type: studentData.student_type || '',
            year: studentData.year || '',
            status: studentData.status || 'active',
            address: studentData.address || '',
            date_of_birth: studentData.date_of_birth ? studentData.date_of_birth.split('T')[0] : '',
          });
          if (studentData.filiere_id) {
            const filtered = classesArray.filter(cls => cls.filiere_id === studentData.filiere_id);
            console.log('Filtered classes for student:', filtered);
            setFilteredClasses(filtered);
          }
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

  useEffect(() => {
    if (formData.filiere_id) {
      const filtered = classes.filter(cls => cls.filiere_id === formData.filiere_id);
      console.log('Filtered classes:', filtered);
      setFilteredClasses(filtered);
      if (!filtered.some(cls => cls.id === formData.class_id)) {
        setFormData(prev => ({ ...prev, class_id: '' }));
      }
    } else {
      setFilteredClasses([]);
      setFormData(prev => ({ ...prev, class_id: '' }));
    }
  }, [formData.filiere_id, classes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (formData.date_of_birth && isNaN(new Date(formData.date_of_birth).getTime()))
      newErrors.date_of_birth = 'Invalid date of birth';
    if (formData.class_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.class_id))
      newErrors.class_id = 'Class ID must be a valid UUID';

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
        date_of_birth: formData.date_of_birth || null,
        filiere_id: formData.filiere_id || null,
        class_id: formData.class_id || null,
      };
      console.log('Submitting payload:', payload);
      if (id) {
        await updateStudent(id, payload);
      } else {
        await createStudent(payload);
      }
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      let errorMessage = 'Failed to save student. Please check your input and try again.';
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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Student' : 'Add New Student'}</h2>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_id">
                Student ID
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.student_id ? 'border-red-500' : ''}`}
                id="student_id"
                name="student_id"
                type="text"
                value={formData.student_id}
                onChange={handleChange}
              />
              {errors.student_id && <p className="text-red-500 text-xs italic">{errors.student_id}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                First Name
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
                Last Name
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
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filiere_id">
                Filiere
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.filiere_id ? 'border-red-500' : ''}`}
                id="filiere_id"
                name="filiere_id"
                value={formData.filiere_id}
                onChange={handleChange}
              >
                <option value="">Select Filiere</option>
                {filieres.map((filiere, index) => (
                  <option key={filiere.id || index} value={filiere.id}>{filiere.name}</option>
                ))}
              </select>
              {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class_id">
                Class
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.class_id ? 'border-red-500' : ''}`}
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                disabled={!formData.filiere_id}
              >
                <option value="">Select Class</option>
                {filteredClasses.map((cls, index) => (
                  <option key={cls.id || index} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              {errors.class_id && <p className="text-red-500 text-xs italic">{errors.class_id}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_type">
                Student Type
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="student_type"
                name="student_type"
                type="text"
                value={formData.student_type}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                Year
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.year ? 'border-red-500' : ''}`}
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
              </select>
              {errors.year && <p className="text-red-500 text-xs italic">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
                Date of Birth
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date_of_birth ? 'border-red-500' : ''}`}
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs italic">{errors.date_of_birth}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-est-blue text-white rounded-md hover:bg-blue-700"
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

export default StudentForm;