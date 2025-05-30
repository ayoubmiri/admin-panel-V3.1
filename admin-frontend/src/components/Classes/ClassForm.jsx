import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassById, createClass, updateClass } from '../../services/classService';
import { getFilieres } from '../../services/filiereService';

const ClassForm = () => {
  const { filiere_id: filiereIdParam, code: codeParam } = useParams();
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({
    filiere_id: '',
    code: '',
    name: '',
    academic_year: '',
    semester: ''
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filieresData = await getFilieres();
        setFilieres(filieresData);
        
        if (filiereIdParam && codeParam) {
          const classData = await getClassById(filiereIdParam, codeParam);
          setFormData({
            filiere_id: classData.filiere_id,
            code: classData.code,
            name: classData.name,
            academic_year: classData.academic_year || '',
            semester: classData.semester || ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filiereIdParam, codeParam]);

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
    if (!formData.filiere_id) newErrors.filiere_id = 'Filiere is required';
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.name) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setLoading(true);
      if (filiereIdParam && codeParam) {
        await updateClass(filiereIdParam, codeParam, formData);
      } else {
        await createClass(formData);
      }
      navigate('/classes');
    } catch (error) {
      console.error('Error saving class:', error);
      setErrors({ submit: 'Failed to save class. Please try again.' });
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
        <h2 className="font-semibold text-lg">
          {filiereIdParam && codeParam ? 'Edit Class' : 'Add New Class'}
        </h2>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filiere_id">
                Filiere
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.filiere_id ? 'border-red-500' : ''}`}
                id="filiere_id"
                name="filiere_id"
                value={formData.filiere_id}
                onChange={handleChange}
                disabled={!!filiereIdParam}
              >
                <option value="">Select Filiere</option>
                {filieres.map((filiere) => (
                  <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
                ))}
              </select>
              {errors.filiere_id && <p className="text-red-500 text-xs italic">{errors.filiere_id}</p>}
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
                disabled={!!codeParam}
              />
              {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
            </div>
            
            <div className="md:col-span-2">
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
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academic_year">
                Academic Year
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="academic_year"
                name="academic_year"
                type="text"
                value={formData.academic_year}
                onChange={handleChange}
                placeholder="e.g., 2023-2024"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                Semester
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
                <option value="S1">Semester 1</option>
                <option value="S2">Semester 2</option>
                <option value="S3">Semester 3</option>
                <option value="S4">Semester 4</option>
                <option value="S5">Semester 5</option>
                <option value="S6">Semester 6</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/classes')}
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

export default ClassForm;