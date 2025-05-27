import api from './api';

export const getClasses = async (page = 1, limit = 10, search = '', filiereId = '') => {
  try {
    const response = await api.get('/classes', {
      params: { page, limit, search, filiereId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (id) => {
  try {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await api.post('/classes', classData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/classes/${id}`, classData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassesByFiliere = async (filiereId) => {
  try {
    const response = await api.get(`/filieres/${filiereId}/classes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};