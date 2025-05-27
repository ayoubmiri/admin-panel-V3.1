import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../services/courseService';
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchCourses = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await getCourses(page, 10, search);
      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        fetchCourses(currentPage, searchTerm);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Course Management</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <SearchBar onSearch={handleSearch} placeholder="Search courses..." />
          <Link
            to="/courses/new"
            className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Course
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.name}</div>
                  <div className="text-sm text-gray-500">{course.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img className="h-8 w-8 rounded-full" src={course.instructor?.avatar || 'https://via.placeholder.com/40'} alt="" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{course.instructor?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.studentCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/courses/${course.id}`} className="text-est-blue hover:text-blue-700 mr-3">
                    <i className="fas fa-eye"></i>
                  </Link>
                  <Link to={`/courses/edit/${course.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, courses.length)} of {totalPages * 10} courses
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CourseList;