import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState({
    schoolName: '',
    schoolLogo: null,
    academicYear: '',
    defaultRole: 'student',
    registrationStatus: 'open',
    emailVerification: true,
    emailNotifications: true,
    smsNotifications: false,
    notificationEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load settings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setSettings({
      ...settings,
      schoolLogo: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const formData = new FormData();
      formData.append('schoolName', settings.schoolName);
      if (settings.schoolLogo) {
        formData.append('schoolLogo', settings.schoolLogo);
      }
      formData.append('academicYear', settings.academicYear);
      formData.append('defaultRole', settings.defaultRole);
      formData.append('registrationStatus', settings.registrationStatus);
      formData.append('emailVerification', settings.emailVerification);
      formData.append('emailNotifications', settings.emailNotifications);
      formData.append('smsNotifications', settings.smsNotifications);
      formData.append('notificationEmail', settings.notificationEmail);
      
      await updateSettings(formData);
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading settings...</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">System Settings</h2>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Settings */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-lg mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schoolName">
                    School Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="schoolName"
                    name="schoolName"
                    type="text"
                    value={settings.schoolName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schoolLogo">
                    School Logo
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="schoolLogo"
                    name="schoolLogo"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {settings.schoolLogoUrl && !settings.schoolLogo && (
                    <div className="mt-2">
                      <img src={settings.schoolLogoUrl} alt="Current logo" className="h-16" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYear">
                    Academic Year
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="academicYear"
                    name="academicYear"
                    type="text"
                    value={settings.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2024-2025"
                  />
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-lg mb-4">User Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="defaultRole">
                    Default Role
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="defaultRole"
                    name="defaultRole"
                    value={settings.defaultRole}
                    onChange={handleChange}
                  >
                    <option value="admin">Administrator</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationStatus">
                    Registration
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="registrationStatus"
                    name="registrationStatus"
                    value={settings.registrationStatus}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="invitation">By Invitation</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    id="emailVerification"
                    name="emailVerification"
                    type="checkbox"
                    checked={settings.emailVerification}
                    onChange={handleChange}
                    className="h-4 w-4 text-est-blue focus:ring-est-blue border-gray-300 rounded"
                  />
                  <label htmlFor="emailVerification" className="ml-2 block text-sm text-gray-700">
                    Email Verification Required
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-lg mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-est-blue focus:ring-est-blue border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="smsNotifications"
                    name="smsNotifications"
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-est-blue focus:ring-est-blue border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notificationEmail">
                    Notification Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="notificationEmail"
                    name="notificationEmail"
                    type="email"
                    value={settings.notificationEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6 flex justify-end">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-est-blue text-white rounded-md hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;