import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentAnnouncements } from '../../services/dashboardService';

const RecentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getRecentAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch recent announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow mb-6 animate-pulse">
        <div className="p-4 border-b h-16 bg-gray-200 rounded-t-lg"></div>
        <div className="divide-y divide-gray-200">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 h-32 bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recent Announcements</h2>
        <Link
          to="/announcements/new"
          className="bg-est-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          <i className="fas fa-plus mr-1"></i> New Announcement
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-gray-500 text-sm">
                  Published on {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.author}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{announcement.content}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t text-right">
        <Link to="/announcements" className="text-sm text-est-blue hover:underline">
          View all announcements →
        </Link>
      </div>
    </div>
  );
};

export default RecentAnnouncements;