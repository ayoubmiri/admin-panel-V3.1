import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherById, createTeacher, updateTeacher } from '../../services/teacherService';
import { getPrograms } from '../../services/courseService';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    programs: [],
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsData = await getPrograms();
        setPrograms(programsData);
        
        if (id) {
          const teacherData = await getTeacherById(id);
          setFormData({
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            phone: teacherData.phone,
            specialization: teacherData.specialization,
            programs: teacherData.programs,
            status: teacherData.status,
          });
        }
      } catch (error) {
        console.error(error);
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

  const handleProgramChange = (programId) => {
    setFormData(prev => {
      const newPrograms = prev.programs.includes(programId)
        ? prev.programs.filter(id => id !== programId)
        : [...prev.programs, programId];
      return { ...prev, programs: newPrograms };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateTeacher(id, formData);
      } else {
        await createTeacher(formData);
      }
      navigate('/teachers');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save teacher. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Teacher' : 'Add New Teacher'}</h2>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''}`}
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">
                Specialization
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
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Assigned Programs
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {programs.map((program) => (
                  <div key={program.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`program-${program.id}`}
                      checked={formData.programs.includes(program.id)}
                      onChange={() => handleProgramChange(program.id)}
                      className="h-4 w-4 text-est-blue focus:ring-est-blue border-gray-300 rounded"
                    />
                    <label htmlFor={`program-${program.id}`} className="ml-2 block text-sm text-gray-700">
                      {program.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/teachers')}
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

export default TeacherForm;