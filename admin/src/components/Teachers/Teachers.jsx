// src/components/Teachers/Teachers.jsx
import React, { useState } from 'react';
import { FaChalkboardTeacher, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Prof. Mohamed El Fassi', email: 'm.elfassi@estsale.ma', specialization: 'Computer Science', status: 'Active' },
    { id: 2, name: 'Prof. Amina Belhaj', email: 'a.belhaj@estsale.ma', specialization: 'Networks', status: 'Active' },
    { id: 3, name: 'Prof. Karim El Mansouri', email: 'k.mansouri@estsale.ma', specialization: 'Mobile Development', status: 'On Leave' }
  ]);

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Teachers Management</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Teacher
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <FaChalkboardTeacher className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {teacher.status}
                  </span>
                </td>
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

export default Teachers;