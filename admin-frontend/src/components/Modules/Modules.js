// src/components/Module/Module.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getModules } from '../../services/moduleService';

const Module = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules(searchTerm);
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="font-semibold text-lg mb-2 md:mb-0">Module Management</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search modules..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/modules/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Module
          </Link>
        </form>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading modules...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filiere</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map((module) => (
                <tr key={module.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{module.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.filiere?.name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      module.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {module.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/modules/${module.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEye />
                    </Link>
                    <Link to={`/modules/edit/${module.id}`} className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <FaEdit />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Module;