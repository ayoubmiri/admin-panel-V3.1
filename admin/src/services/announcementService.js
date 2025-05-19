import api from './api';

export const getAnnouncements = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await api.get('/announcements', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};