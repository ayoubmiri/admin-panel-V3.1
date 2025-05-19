// src/components/Announcements/Announcements.jsx
import React, { useState } from 'react';
import { FaBullhorn, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'New Software Engineering Program', 
      content: 'Discover our new program with modules on AI, cloud computing and cybersecurity...',
      date: '15 Mar 2025',
      author: 'Admin User',
      category: 'Academic'
    },
    { 
      id: 2, 
      title: 'Open House Day', 
      content: 'We invite you to our open house day on May 15th to discover our programs...',
      date: '10 Mar 2025',
      author: 'Admin User',
      category: 'Event'
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Announcements</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> New Announcement
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-gray-500 text-sm">Posted on {announcement.date} by {announcement.author}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {announcement.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-yellow-500 hover:text-yellow-700">
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;