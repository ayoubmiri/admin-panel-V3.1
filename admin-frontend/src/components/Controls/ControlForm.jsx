import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getControlById, createControl, updateControl } from '../../services/controlService';
import { getElements } from '../../services/elementService';

const ControlForm = () => {
  const { id, elementId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    elementId: elementId || '',
    controlType: 'quiz',
    date: new Date().toISOString().split('T')[0],
    maxScore: 20,
    weight: 1,
    status: 'scheduled'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const elementsData = await getElements();
        setElements(elementsData);
        
        if (id) {
          const controlData = await getControlById(id);
          setFormData({
            title: controlData.title,
            description: controlData.description,
            elementId: controlData.elementId,
            controlType: controlData.controlType,
            date: controlData.date.split('T')[0],
            maxScore: controlData.maxScore,
            weight: controlData.weight,
            status: controlData.status
          });
        } else if (elementId) {
          setFormData(prev => ({ ...prev, elementId }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, elementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.elementId) newErrors.elementId = 'Element is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.maxScore <= 0) newErrors.maxScore = 'Max score must be positive';
    if (formData.weight <= 0) newErrors.weight = 'Weight must be positive';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateControl(id, formData);
      } else {
        await createControl(formData);
      }
      navigate(elementId ? `/elements/${elementId}/controls` : '/controls');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save control. Please try again.' });
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
        <h2 className="font-semibold text-lg">{id ? 'Edit Control' : 'Add New Control'}</h2>
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
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="elementId">
                Element
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.elementId ? 'border-red-500' : ''}`}
                id="elementId"
                name="elementId"
                value={formData.elementId}
                onChange={handleChange}
                disabled={!!elementId}
              >
                <option value="">Select Element</option>
                {elements.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.name} ({element.code})
                  </option>
                ))}
              </select>
              {errors.elementId && <p className="text-red-500 text-xs italic">{errors.elementId}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="controlType">
                Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="controlType"
                name="controlType"
                value={formData.controlType}
                onChange={handleChange}
              >
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="presentation">Presentation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date ? 'border-red-500' : ''}`}
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxScore">
                Max Score
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.maxScore ? 'border-red-500' : ''}`}
                id="maxScore"
                name="maxScore"
                type="number"
                min="1"
                step="0.5"
                value={formData.maxScore}
                onChange={handleChange}
              />
              {errors.maxScore && <p className="text-red-500 text-xs italic">{errors.maxScore}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
                Weight
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.weight ? 'border-red-500' : ''}`}
                id="weight"
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
              />
              {errors.weight && <p className="text-red-500 text-xs italic">{errors.weight}</p>}
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
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
              onClick={() => navigate(elementId ? `/elements/${elementId}/controls` : '/controls')}
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

export default ControlForm;