// src/components/Courses/Courses.jsx
import React, { useState } from 'react';
import { FaBook, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 4, teacher: 'Prof. El Fassi' },
    { id: 2, code: 'CS201', name: 'Data Structures', credits: 3, teacher: 'Prof. Belhaj' },
    { id: 3, code: 'CS301', name: 'Database Systems', credits: 3, teacher: 'Prof. Mansouri' }
  ]);

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Courses Management</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Course
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBook className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{course.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.teacher}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEye />
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;