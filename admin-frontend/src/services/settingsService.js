import api from './api';

export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (formData) => {
  try {
    const response = await api.put('/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAcademicYears = async () => {
  try {
    const response = await api.get('/settings/years');
    return response.data;
  } catch (error) {
    throw error;
  }
};