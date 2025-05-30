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
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    filiere_id: '',
    class_id: '',
    student_type: 'regular',
    year: '1',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filieresData, classesData] = await Promise.all([
          getFilieres(),
          getClasses()
        ]);
        setFilieres(filieresData);
        setClasses(classesData);
        
        if (id) {
          const studentData = await getStudentById(id);
          setFormData({
            student_id: studentData.student_id,
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            email: studentData.email,
            phone: studentData.phone || '',
            address: studentData.address || '',
            date_of_birth: studentData.date_of_birth?.split('T')[0] || '',
            filiere_id: studentData.filiere_id,
            class_id: studentData.class_id || '',
            student_type: studentData.student_type || 'regular',
            year: studentData.year || '1',
            status: studentData.status || 'active'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Student ID is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateStudent(id, formData);
      } else {
        await createStudent(formData);
      }
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
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
        <h2 className="font-semibold text-lg">{id ? 'Edit Student' : 'Add New Student'}</h2>
      </div>
      
      <div className="p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
                Date of Birth
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
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
                {filieres.map((filiere) => (
                  <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
                ))}
              </select>
              {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class_id">
                Class (Optional)
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                {classes.filter(c => c.filiere_id === formData.filiere_id).map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_type">
                Student Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="student_type"
                name="student_type"
                value={formData.student_type}
                onChange={handleChange}
              >
                <option value="regular">Regular</option>
                <option value="transfer">Transfer</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                Year
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
              </select>
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
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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

export default StudentForm;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getStudentById, createStudent, updateStudent } from '../../services/studentService';
// import { getCourses } from '../../services/courseService';

// const StudentForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [programs, setPrograms] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     program: '',
//     year: '',
//     status: 'active',
//     address: '',
//     dateOfBirth: '',
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const programsData = await getCourses();
//         setPrograms(programsData);
        
//         if (id) {
//           const studentData = await getStudentById(id);
//           setFormData({
//             firstName: studentData.firstName,
//             lastName: studentData.lastName,
//             email: studentData.email,
//             phone: studentData.phone,
//             program: studentData.program,
//             year: studentData.year,
//             status: studentData.status,
//             address: studentData.address,
//             dateOfBirth: studentData.dateOfBirth,
//           });
//         }
//       } catch (error) {
//         console.error(error);
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
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     if (!formData.program) newErrors.program = 'Program is required';
//     if (!formData.year) newErrors.year = 'Year is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     try {
//       setLoading(true);
//       if (id) {
//         await updateStudent(id, formData);
//       } else {
//         await createStudent(formData);
//       }
//       navigate('/students');
//     } catch (error) {
//       console.error(error);
//       setErrors({ submit: 'Failed to save student. Please try again.' });
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
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//             {errors.submit}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
//                 First Name
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''}`}
//                 id="firstName"
//                 name="firstName"
//                 type="text"
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//               {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
//                 Last Name
//               </label>
//               <input
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
//                 id="lastName"
//                 name="lastName"
//                 type="text"
//                 value={formData.lastName}
//                 onChange={handleChange}
//               />
//               {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
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
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
//                 Program
//               </label>
//               <select
//                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.program ? 'border-red-500' : ''}`}
//                 id="program"
//                 name="program"
//                 value={formData.program}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Program</option>
//                 {programs.map((program) => (
//                   <option key={program.id} value={program.id}>{program.name}</option>
//                 ))}
//               </select>
//               {errors.program && <p className="text-red-500 text-xs italic">{errors.program}</p>}
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
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
//                 Date of Birth
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="dateOfBirth"
//                 name="dateOfBirth"
//                 type="date"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//               />
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