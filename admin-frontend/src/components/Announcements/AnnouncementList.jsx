import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements, deleteAnnouncement } from '../../services/announcementService';
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchAnnouncements = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await getAnnouncements(page, 10, search);
      setAnnouncements(data.announcements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch announcements. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        fetchAnnouncements(currentPage, searchTerm);
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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Announcement Management</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <SearchBar onSearch={handleSearch} placeholder="Search announcements..." />
          <Link
            to="/announcements/new"
            className="bg-est-green text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> New Announcement
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-gray-500 text-sm">
                  Published on {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.createdBy}
                </p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    announcement.category === 'event' ? 'bg-purple-100 text-purple-800' :
                    announcement.category === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  } mr-1`}>
                    {announcement.category}
                  </span>
                  {announcement.isImportant && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Important
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/announcements/${announcement.id}`} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-eye"></i>
                </Link>
                <Link to={`/announcements/edit/${announcement.id}`} className="text-yellow-500 hover:text-yellow-700">
                  <i className="fas fa-edit"></i>
                </Link>
                <button 
                  onClick={() => handleDelete(announcement.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{announcement.content}</p>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, announcements.length)} of {totalPages * 10} announcements
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

export default AnnouncementList;