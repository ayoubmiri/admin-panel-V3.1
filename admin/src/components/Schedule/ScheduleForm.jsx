import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getScheduleById, createSchedule, updateSchedule } from '../../services/scheduleService';
import { getCourses } from '../../services/courseService';

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    day: 'Monday',
    startTime: '08:30',
    endTime: '10:00',
    room: '',
    type: 'lecture',
    programId: '',
    academicYear: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        if (id) {
          const scheduleData = await getScheduleById(id);
          setFormData({
            courseId: scheduleData.courseId,
            day: scheduleData.day,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            room: scheduleData.room,
            type: scheduleData.type,
            programId: scheduleData.programId,
            academicYear: scheduleData.academicYear,
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
    
    // If course changes, update programId
    if (name === 'courseId') {
      const selectedCourse = courses.find(c => c.id === value);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          courseId: value,
          programId: selectedCourse.programId
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.room) newErrors.room = 'Room is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      if (id) {
        await updateSchedule(id, formData);
      } else {
        await createSchedule(formData);
      }
      navigate('/schedule');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save schedule. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Schedule' : 'Add New Schedule'}</h2>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseId">
                Course
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.courseId ? 'border-red-500' : ''}`}
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-xs italic">{errors.courseId}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day">
                Day
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.day ? 'border-red-500' : ''}`}
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              {errors.day && <p className="text-red-500 text-xs italic">{errors.day}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                Start Time
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.startTime ? 'border-red-500' : ''}`}
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              >
                <option value="08:30">08:30</option>
                <option value="10:15">10:15</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
                <option value="15:45">15:45</option>
              </select>
              {errors.startTime && <p className="text-red-500 text-xs italic">{errors.startTime}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                End Time
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.endTime ? 'border-red-500' : ''}`}
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              >
                <option value="10:00">10:00</option>
                <option value="11:45">11:45</option>
                <option value="13:30">13:30</option>
                <option value="15:30">15:30</option>
                <option value="17:15">17:15</option>
              </select>
              {errors.endTime && <p className="text-red-500 text-xs italic">{errors.endTime}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room">
                Room
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.room ? 'border-red-500' : ''}`}
                id="room"
                name="room"
                type="text"
                value={formData.room}
                onChange={handleChange}
              />
              {errors.room && <p className="text-red-500 text-xs italic">{errors.room}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="lecture">Lecture</option>
                <option value="lab">Lab</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYear">
                Academic Year
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="academicYear"
                name="academicYear"
                type="text"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="e.g. 2024-2025"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/schedule')}
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

export default ScheduleForm;