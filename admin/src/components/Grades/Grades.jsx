// src/components/Grades/Grades.jsx
import React, { useState } from 'react';
import { FaFileAlt, FaSearch } from 'react-icons/fa';

const Grades = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState('All');

  const gradesData = [
    { student: 'Ahmed El Amrani', course: 'Algorithmics', cc: 16.5, exam: 14.0, final: 15.25, status: 'Passed' },
    { student: 'Imane Benali', course: 'Database Systems', cc: 12.0, exam: 10.5, final: 11.25, status: 'Passed' },
    { student: 'Karim Zouhair', course: 'Web Development', cc: 8.5, exam: 7.0, final: 7.75, status: 'Failed' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Grades Management</h2>
        <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <label className="mr-2">Class:</label>
            <select 
              className="border rounded px-2 py-1"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option>All</option>
              <option>Software Engineering</option>
              <option>Networks</option>
              <option>Mobile Development</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="mr-2">Student:</label>
            <select 
              className="border rounded px-2 py-1"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option>All</option>
              <option>Ahmed El Amrani</option>
              <option>Imane Benali</option>
              <option>Karim Zouhair</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center">
            <FaSearch className="mr-2" /> Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CC Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gradesData.map((grade, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaFileAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{grade.student}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.course}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.cc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.exam}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.final}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    grade.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {grade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;