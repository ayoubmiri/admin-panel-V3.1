import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExams, deleteExam, getExamsByFiliere } from '../../services/examService';
import { getFilieres } from '../../services/filiereService';
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const { filiereId } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [filieresData] = await Promise.all([
        getFilieres()
      ]);
      setFilieres(filieresData);
      
      const data = filiereId 
        ? await getExamsByFiliere(filiereId, currentPage, 10, searchTerm)
        : await getExams(currentPage, 10, searchTerm);
        
      setExams(data.exams);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch exams. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filiereId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(id);
        fetchData();
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

  const getFiliereName = (id) => {
    const filiere = filieres.find(f => f.id === id);
    return filiere ? filiere.name : 'Unknown';
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">
          {filiereId ? 'Filiere Exams' : 'All Exams'}
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <SearchBar onSearch={handleSearch} placeholder="Search exams..." />
          <Link
            to={filiereId ? `/filieres/${filiereId}/exams/new` : "/exams/new"}
            className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Exam
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              {!filiereId && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filiere</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                  <div className="text-sm text-gray-500">{exam.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{exam.examType}</td>
                {!filiereId && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/filieres/${exam.filiereId}`} className="text-est-blue hover:underline">
                      {getFiliereName(exam.filiereId)}
                    </Link>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(exam.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    exam.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/exams/${exam.id}`} className="text-est-blue hover:text-blue-700 mr-3">
                    <i className="fas fa-eye"></i>
                  </Link>
                  <Link to={`/exams/edit/${exam.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button 
                    onClick={() => handleDelete(exam.id)} 
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
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, exams.length)} of {totalPages * 10} exams
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

export default ExamList;