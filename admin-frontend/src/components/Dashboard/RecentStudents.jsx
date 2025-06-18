import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Import the configured Axios instance

const RecentStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentStudents = async () => {
      try {
        setLoading(true);
        // Fetch students and filieres
        const [studentsResponse, filieresResponse] = await Promise.all([
          api.get('/students'),
          api.get('/filieres'),
        ]);

        const studentsData = studentsResponse.data;
        const filieres = filieresResponse.data;

        // Create filiere ID-to-name map
        const filiereMap = filieres.reduce((acc, f) => {
          acc[f.id] = f.name;
          return acc;
        }, {});

        // Map and sort students
        const mappedStudents = studentsData
          .map(student => ({
            id: student.id,
            fullName: `${student.first_name} ${student.last_name}`,
            email: student.email,
            program: filiereMap[student.filiere_id] || 'Unknown',
            enrollmentDate: student.created_at,
            status: student.status || 'unknown',
            avatar: student.avatar || 'https://via.placeholder.com/40',
          }))
          .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
          .slice(0, 5); // Limit to 5 recent students

        setStudents(mappedStudents);
      } catch (error) {
        console.error('Failed to fetch recent students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStudents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow lg:col-span-2 animate-pulse">
        <div className="p-4 border-b h-16 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow lg:col-span-2">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-gray-800">Recently Enrolled Students</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.program}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t text-right">
        <Link to="/students" className="text-sm text-est-blue hover:underline">
          View all students →
        </Link>
      </div>
    </div>
  );
};

export default RecentStudents;
