import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGradeById, createGrade, updateGrade } from '../../services/gradeService';
import { getStudents } from '../../services/studentService';
import { getCourses } from '../../services/courseService';

const GradeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    ccScore: '',
    examScore: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, coursesData] = await Promise.all([
          getStudents(),
          getCourses()
        ]);
        
        setStudents(studentsData);
        setCourses(coursesData);
        
        if (id) {
          const gradeData = await getGradeById(id);
          setFormData({
            studentId: gradeData.studentId,
            courseId: gradeData.courseId,
            ccScore: gradeData.ccScore,
            examScore: gradeData.examScore,
            status: gradeData.status,
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

  const calculateFinalScore = () => {
    if (formData.ccScore && formData.examScore) {
      const cc = parseFloat(formData.ccScore) || 0;
      const exam = parseFloat(formData.examScore) || 0;
      return (cc * 0.4 + exam * 0.6).toFixed(2);
    }
    return '';
  };

  const determineStatus = () => {
    const finalScore = calculateFinalScore();
    if (finalScore) {
      return parseFloat(finalScore) >= 10 ? 'passed' : 'failed';
    }
    return 'pending';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.ccScore) newErrors.ccScore = 'CC score is required';
    if (!formData.examScore) newErrors.examScore = 'Exam score is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const gradeData = {
        ...formData,
        finalScore: calculateFinalScore(),
        status: determineStatus()
      };
      
      if (id) {
        await updateGrade(id, gradeData);
      } else {
        await createGrade(gradeData);
      }
      navigate('/grades');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save grade. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{id ? 'Edit Grade' : 'Add New Grade'}</h2>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
                Student
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.studentId ? 'border-red-500' : ''}`}
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.studentId} - {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
              {errors.studentId && <p className="text-red-500 text-xs italic">{errors.studentId}</p>}
            </div>
            
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
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-xs italic">{errors.courseId}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ccScore">
                Continuous Assessment (40%)
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.ccScore ? 'border-red-500' : ''}`}
                id="ccScore"
                name="ccScore"
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={formData.ccScore}
                onChange={handleChange}
              />
              {errors.ccScore && <p className="text-red-500 text-xs italic">{errors.ccScore}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examScore">
                Exam Score (60%)
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.examScore ? 'border-red-500' : ''}`}
                id="examScore"
                name="examScore"
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={formData.examScore}
                onChange={handleChange}
              />
              {errors.examScore && <p className="text-red-500 text-xs italic">{errors.examScore}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Final Score
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                type="text"
                value={calculateFinalScore()}
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                type="text"
                value={determineStatus()}
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/grades')}
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

export default GradeForm;