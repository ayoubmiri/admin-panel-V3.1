import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAssignments, deleteAssignment, getAssignmentsByElement } from '../../services/assignmentService';
import { getElements } from '../../services/elementService';
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [elements, setElements] = useState([]);
  const { elementId } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const elementsData = await getElements();
      setElements(elementsData);
      
      const data = elementId 
        ? await getAssignmentsByElement(elementId, currentPage, 10, searchTerm)
        : await getAssignments(currentPage, 10, searchTerm);
        
      setAssignments(data.assignments);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, elementId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
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

  const getElementName = (id) => {
    const element = elements.find(e => e.id === id);
    return element ? `${element.name} (${element.code})` : 'Unknown';
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
          {elementId ? 'Element Assignments' : 'All Assignments'}
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <SearchBar onSearch={handleSearch} placeholder="Search assignments..." />
          <Link
            to={elementId ? `/elements/${elementId}/assignments/new` : "/assignments/new"}
            className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Assignment
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {!elementId && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                {!elementId && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/elements/${assignment.elementId}`} className="text-est-blue hover:underline">
                      {getElementName(assignment.elementId)}
                    </Link>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                  <div className="text-sm text-gray-500">{assignment.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {assignment.submissionCount || 0} / {assignment.studentCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/assignments/${assignment.id}`} className="text-est-blue hover:text-blue-700 mr-3">
                    <i className="fas fa-eye"></i>
                  </Link>
                  <Link to={`/assignments/edit/${assignment.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button 
                    onClick={() => handleDelete(assignment.id)} 
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
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, assignments.length)} of {totalPages * 10} assignments
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

export default AssignmentList;