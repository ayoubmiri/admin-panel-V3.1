import api from './api';

export const getGrades = async (programId, courseId, year, page = 1, limit = 10) => {
  try {
    const response = await api.get('/grades', {
      params: { programId, courseId, year, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGradeById = async (id) => {
  try {
    const response = await api.get(`/grades/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createGrade = async (gradeData) => {
  try {
    const response = await api.post('/grades', gradeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGrade = async (id, gradeData) => {
  try {
    const response = await api.put(`/grades/${id}`, gradeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGrade = async (id) => {
  try {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importGrades = async (formData) => {
  try {
    const response = await api.post('/grades/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};