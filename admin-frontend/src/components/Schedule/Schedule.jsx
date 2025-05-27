// src/components/Schedule/Schedule.jsx
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const Schedule = () => {
  const scheduleData = [
    { day: 'Monday', time: '08:30 - 10:00', course: 'Algorithmics', room: 'A12', teacher: 'Prof. El Fassi' },
    { day: 'Tuesday', time: '10:15 - 11:45', course: 'Database Systems', room: 'B05', teacher: 'Prof. Belhaj' },
    { day: 'Wednesday', time: '13:00 - 14:30', course: 'Web Development', room: 'C03', teacher: 'Prof. Mansouri' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Class Schedule</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
          <FaCalendarAlt className="mr-2" /> Generate Schedule
        </button>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Day</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Room</th>
                <th className="px-4 py-2 border">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border font-medium">{item.day}</td>
                  <td className="px-4 py-2 border">{item.time}</td>
                  <td className="px-4 py-2 border">{item.course}</td>
                  <td className="px-4 py-2 border">{item.room}</td>
                  <td className="px-4 py-2 border">{item.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;