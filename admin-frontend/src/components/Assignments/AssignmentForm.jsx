// src/components/Assignments/AssignmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssignmentById, createAssignment, updateAssignment } from '../../services/assignmentService';
import { getElements } from '../../services/elementService';

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    element_id: '',
    due_date: new Date().toISOString().split('T')[0],
    max_score: '100',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const elementsData = await getElements();
        setElements(elementsData);
        
        if (id) {
          const assignmentData = await getAssignmentById(id);
          setFormData({
            title: assignmentData.title,
            description: assignmentData.description,
            element_id: assignmentData.element_id,
            due_date: assignmentData.due_date.split('T')[0],
            max_score: assignmentData.max_score,
            status: assignmentData.status
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
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.element_id) newErrors.element_id = 'Element is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateAssignment(id, formData);
      } else {
        await createAssignment(formData);
      }
      navigate('/assignments');
    } catch (error) {
      console.error('Error saving assignment:', error);
      setErrors({ submit: 'Failed to save assignment. Please try again.' });
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
        <h2 className="font-semibold text-lg">{id ? 'Edit Assignment' : 'Add New Assignment'}</h2>
      </div>
      
      <div className="p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="element_id">
                Element
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.element_id ? 'border-red-500' : ''}`}
                id="element_id"
                name="element_id"
                value={formData.element_id}
                onChange={handleChange}
              >
                <option value="">Select Element</option>
                {elements.map((element) => (
                  <option key={element.id} value={element.id}>{element.name}</option>
                ))}
              </select>
              {errors.element_id && <p className="text-red-500 text-xs italic">{errors.element_id}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
                Due Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max_score">
                Max Score
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="max_score"
                name="max_score"
                type="number"
                min="1"
                value={formData.max_score}
                onChange={handleChange}
              />
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
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/assignments')}
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

export default AssignmentForm;