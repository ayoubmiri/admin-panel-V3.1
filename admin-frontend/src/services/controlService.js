import api from './api';

export const getControls = async (page = 1, limit = 10, search = '', elementId = '') => {
  try {
    const response = await api.get('/controls', {
      params: { page, limit, search, elementId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getControlById = async (id) => {
  try {
    const response = await api.get(`/controls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createControl = async (controlData) => {
  try {
    const response = await api.post('/controls', controlData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateControl = async (id, controlData) => {
  try {
    const response = await api.put(`/controls/${id}`, controlData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteControl = async (id) => {
  try {
    const response = await api.delete(`/controls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getControlsByElement = async (elementId) => {
  try {
    const response = await api.get(`/elements/${elementId}/controls`);
    return response.data;
  } catch (error) {
    throw error;
  }
};