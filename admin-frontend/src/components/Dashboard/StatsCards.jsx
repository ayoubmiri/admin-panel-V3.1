import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Import the configured Axios instance

const StatsCards = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    successRate: 0,
    studentChange: 0,
    teacherChange: 0,
    courseChange: 0,
    successRateChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch students
        const studentsResponse = await api.get('/students');
        const students = studentsResponse.data;

        // Fetch classes (for courses)
        const classesResponse = await api.get('/classes');
        const classes = classesResponse.data.classes || classesResponse.data;

        // Compute stats
        const totalStudents = students.length;
        const totalCourses = classes.length;
        const activeStudents = students.filter(s => s.status === 'active').length;
        const successRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

        // Placeholder for teachers (using unique filiere_id as proxy)
        const uniqueFiliereIds = [...new Set(classes.map(c => c.filiere_id))].length;
        // Alternative: Set to 0 if teachers not applicable
        // const totalTeachers = 0;

        // Placeholder for changes (no historical data)
        const studentChange = 0;
        const teacherChange = 0;
        const courseChange = 0;
        const successRateChange = 0;

        setStats({
          students: totalStudents,
          teachers: uniqueFiliereIds, // or totalTeachers
          courses: totalCourses,
          successRate,
          studentChange,
          teacherChange,
          courseChange,
          successRateChange,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Optional: Set fallback stats or show error state
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-24 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-6">
      {/* Students Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Students</p>
            <h3 className="text-2xl font-bold">{stats.students.toLocaleString()}</h3>
            <p className={`text-xs ${stats.studentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.studentChange >= 0 ? '+' : ''}{stats.studentChange}% since last month
            </p>
          </div>
        </div>
      </div>

      {/* Teachers Card (optional, remove if not needed) */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Teachers</p>
            <h3 className="text-2xl font-bold">{stats.teachers}</h3>
            <p className={`text-xs ${stats.teacherChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.teacherChange >= 0 ? '+' : ''}{stats.teacherChange} since last month
            </p>
          </div>
        </div>
      </div>

      {/* Courses Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <i className="fas fa-book"></i>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Courses</p>
            <h3 className="text-2xl font-bold">{stats.courses}</h3>
            <p className="text-gray-600 text-xs">{stats.courseChange} new this year</p>
          </div>
        </div>
      </div>

      {/* Success Rate Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Success Rate</p>
            <h3 className="text-2xl font-bold">{stats.successRate}%</h3>
            <p className={`text-xs ${stats.successRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.successRateChange >= 0 ? '+' : ''}{stats.successRateChange}% vs last year
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;











// import React, { useEffect, useState } from 'react';
// import { getDashboardStats } from '../../services/dashboardService';

// const StatsCards = () => {
//   const [stats, setStats] = useState({
//     students: 0,
//     teachers: 0,
//     courses: 0,
//     successRate: 0,
//     studentChange: 0,
//     teacherChange: 0,
//     courseChange: 0,
//     successRateChange: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const data = await getDashboardStats();
//         setStats(data);
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
//             <div className="h-24 bg-gray-200 rounded"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       {/* Students Card */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex items-center">
//           <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//             <i className="fas fa-users"></i>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Students</p>
//             <h3 className="text-2xl font-bold">{stats.students.toLocaleString()}</h3>
//             <p className={`text-xs ${stats.studentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//               {stats.studentChange >= 0 ? '+' : ''}{stats.studentChange}% since last month
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Teachers Card */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex items-center">
//           <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//             <i className="fas fa-chalkboard-teacher"></i>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Teachers</p>
//             <h3 className="text-2xl font-bold">{stats.teachers}</h3>
//             <p className={`text-xs ${stats.teacherChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//               {stats.teacherChange >= 0 ? '+' : ''}{stats.teacherChange} since last month
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Courses Card */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex items-center">
//           <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//             <i className="fas fa-book"></i>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Courses</p>
//             <h3 className="text-2xl font-bold">{stats.courses}</h3>
//             <p className="text-gray-500 text-xs">{stats.courseChange} new this year</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Success Rate Card */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex items-center">
//           <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//             <i className="fas fa-graduation-cap"></i>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Success Rate</p>
//             <h3 className="text-2xl font-bold">{stats.successRate}%</h3>
//             <p className={`text-xs ${stats.successRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//               {stats.successRateChange >= 0 ? '+' : ''}{stats.successRateChange}% vs last year
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCards;