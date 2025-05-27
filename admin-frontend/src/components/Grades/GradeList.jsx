import React, { useState, useEffect } from 'react';
import { getGrades, deleteGrade, importGrades } from '../../services/gradeService';
import { getCourses } from '../../services/courseService';
import { getPrograms } from '../../services/programService';
import Pagination from '../../components/Common/Pagination';

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState(['1', '2', '3']);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programsData, coursesData] = await Promise.all([
        getPrograms(),
        getCourses()
      ]);
      
      setPrograms(programsData);
      setCourses(coursesData);
      
      if (programsData.length > 0) {
        setSelectedProgram(programsData[0].id);
        fetchGrades(programsData[0].id, '', '1');
      }
    } catch (err) {
      setError('Failed to fetch initial data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async (programId, courseId, year) => {
    try {
      setLoading(true);
      const data = await getGrades(programId, courseId, year, currentPage, 10);
      setGrades(data.grades);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch grades. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchGrades(selectedProgram, selectedCourse, selectedYear);
    }
  }, [selectedProgram, selectedCourse, selectedYear, currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await deleteGrade(id);
        fetchGrades(selectedProgram, selectedCourse, selectedYear);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', selectedCourse);

      await importGrades(formData);
      fetchGrades(selectedProgram, selectedCourse, selectedYear);
      alert('Grades imported successfully');
      setFile(null);
    } catch (error) {
      console.error(error);
      alert('Failed to import grades. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Grade Management</h2>
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
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.filter(c => c.programId === selectedProgram).map(course => (
              <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-est-blue"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="gradeFile"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <label
              htmlFor="gradeFile"
              className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer mr-2"
            >
              <i className="fas fa-file-import mr-2"></i> Choose File
            </label>
            {file && (
              <span className="text-sm mr-2">{file.name}</span>
            )}
            <button
              onClick={handleImport}
              className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
              disabled={!file || !selectedCourse}
            >
              <i className="fas fa-upload mr-2"></i> Import
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CC Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={grade.student.avatar || 'https://via.placeholder.com/40'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{grade.student.fullName}</div>
                      <div className="text-sm text-gray-500">{grade.student.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.course.code} - {grade.course.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.ccScore}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.examScore}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {grade.finalScore.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    grade.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {grade.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(grade.id)} 
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
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, grades.length)} of {totalPages * 10} grades
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

export default GradeList;