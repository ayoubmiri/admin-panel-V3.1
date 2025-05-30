import api from './api';

export const getClasses = async (skip = 0, limit = 10, filiereId = '', search = '') => {
  try {
    const params = { skip, limit, ...(search && { search }) };
    if (filiereId) {
      const response = await api.get(`/classes/filiere/${filiereId}`, { params });
      return response.data;
    }
    const response = await api.get('/classes', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (filiereId, code) => {
  try {
    const response = await api.get(`/classes/${filiereId}/${code}`);
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

export const updateClass = async (filiereId, code, classData) => {
  try {
    const response = await api.put(`/classes/${filiereId}/${code}`, classData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClass = async (filiereId, code) => {
  try {
    const response = await api.delete(`/classes/${filiereId}/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};