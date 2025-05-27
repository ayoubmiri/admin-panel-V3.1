import api from './api';

export const getAssignments = async (page = 1, limit = 10, search = '', elementId = '') => {
  try {
    const response = await api.get('/assignments', {
      params: { page, limit, search, elementId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssignmentById = async (id) => {
  try {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAssignment = async (id) => {
  try {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssignmentsByElement = async (elementId) => {
  try {
    const response = await api.get(`/elements/${elementId}/assignments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitAssignment = async (assignmentId, studentId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/assignments/${assignmentId}/submit/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};