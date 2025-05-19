import api from './api';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEnrollmentStats = async () => {
  try {
    const response = await api.get('/dashboard/enrollment');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendanceStats = async () => {
  try {
    const response = await api.get('/dashboard/attendance');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentStudents = async () => {
  try {
    const response = await api.get('/dashboard/recent-students');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await api.get('/dashboard/upcoming-events');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentAnnouncements = async () => {
  try {
    const response = await api.get('/dashboard/recent-announcements');
    return response.data;
  } catch (error) {
    throw error;
  }
};