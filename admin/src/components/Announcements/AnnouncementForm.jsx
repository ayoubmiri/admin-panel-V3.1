import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnnouncementById, createAnnouncement, updateAnnouncement } from '../../services/announcementService';

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'information',
    isImportant: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const announcementData = await getAnnouncementById(id);
          setFormData({
            title: announcementData.title,
            content: announcementData.content,
            category: announcementData.category,
            isImportant: announcementData.isImportant,
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateAnnouncement(id, formData);
      } else {
        await createAnnouncement(formData);
      }
      navigate('/announcements');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save announcement. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Announcement' : 'New Announcement'}</h2>
      </div>
      
      <div className="p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="information">Information</option>
              <option value="event">Event</option>
              <option value="workshop">Workshop</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.content ? 'border-red-500' : ''}`}
              id="content"
              name="content"
              rows="6"
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && <p className="text-red-500 text-xs italic">{errors.content}</p>}
          </div>
          
          <div className="flex items-center mb-4">
            <input
              id="isImportant"
              name="isImportant"
              type="checkbox"
              checked={formData.isImportant}
              onChange={handleChange}
              className="h-4 w-4 text-est-blue focus:ring-est-blue border-gray-300 rounded"
            />
            <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-700">
              Mark as important
            </label>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/announcements')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-est-blue text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;