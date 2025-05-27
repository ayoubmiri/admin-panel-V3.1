import React, { useState, useEffect } from 'react';
import { getSchedule, getCourses } from '../../services/scheduleService';
import { getPrograms } from '../../services/programService';
import { getAcademicYears } from '../../services/settingsService';

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { start: '08:30', end: '10:00' },
    { start: '10:15', end: '11:45' },
    { start: '12:00', end: '13:30' },
    { start: '14:00', end: '15:30' },
    { start: '15:45', end: '17:15' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programsData, yearsData] = await Promise.all([
        getPrograms(),
        getAcademicYears()
      ]);
      
      setPrograms(programsData);
      setYears(yearsData);
      
      if (programsData.length > 0 && yearsData.length > 0) {
        setSelectedProgram(programsData[0].id);
        setSelectedYear(yearsData[0]);
        fetchSchedule(programsData[0].id, yearsData[0]);
      }
    } catch (err) {
      setError('Failed to fetch initial data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (programId, year) => {
    try {
      setLoading(true);
      const data = await getSchedule(programId, year);
      setSchedule(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedule. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = () => {
    if (selectedProgram && selectedYear) {
      fetchSchedule(selectedProgram, selectedYear);
    }
  };

  const getCourseForSlot = (day, timeSlot) => {
    return schedule.find(item => 
      item.day.toLowerCase() === day.toLowerCase() && 
      item.startTime === timeSlot.start && 
      item.endTime === timeSlot.end
    );
  };

  const getColorClass = (courseType) => {
    switch (courseType) {
      case 'lecture': return 'bg-blue-50 border-blue-500';
      case 'lab': return 'bg-green-50 border-green-500';
      case 'seminar': return 'bg-purple-50 border-purple-500';
      default: return 'bg-gray-50 border-gray-500';
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Schedule Management</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select 
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-est-blue"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            {programs.map(program => (
              <option key={program.id} value={program.id}>{program.name}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-est-blue"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button 
            onClick={handleFilterChange}
            className="bg-est-blue text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <i className="fas fa-search mr-2"></i> Filter
          </button>
          <button className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center">
            <i className="fas fa-plus mr-2"></i> Add
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border font-medium">Time</th>
              {days.map(day => (
                <th key={day} className="px-4 py-2 border">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border font-medium">{timeSlot.start} - {timeSlot.end}</td>
                {days.map(day => {
                  const course = getCourseForSlot(day, timeSlot);
                  return (
                    <td key={day} className="px-4 py-2 border">
                      {course ? (
                        <div className={`p-2 rounded border-l-4 ${getColorClass(course.type)}`}>
                          <p className="font-medium">{course.courseName}</p>
                          <p className="text-sm">{course.instructor}</p>
                          <p className="text-sm">{course.room}</p>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t flex justify-end">
        <button className="px-4 py-2 bg-est-blue text-white rounded-md hover:bg-blue-700 flex items-center">
          <i className="fas fa-download mr-2"></i> Export
        </button>
      </div>
    </div>
  );
};

export default ScheduleView;