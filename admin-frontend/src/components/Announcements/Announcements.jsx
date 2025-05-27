// src/components/Announcements/Announcements.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaBullhorn } from 'react-icons/fa';
import { getAnnouncements } from '../../services/announcementService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(searchTerm);
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically by the useEffect
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Announcement Management</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search announcements..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/announcements/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> New Announcement
          </Link>
        </form>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading announcements...</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaBullhorn className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Posted on {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.author}
                    </p>
                    {announcement.isImportant && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                        Important
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/announcements/${announcement.id}`} className="text-blue-600 hover:text-blue-900">
                    <FaEye />
                  </Link>
                  <Link to={`/announcements/edit/${announcement.id}`} className="text-yellow-600 hover:text-yellow-900">
                    <FaEdit />
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2 pl-16">{announcement.content.substring(0, 150)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;