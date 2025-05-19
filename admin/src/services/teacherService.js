import api from './api';

export const getTeachers = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await api.get('/teachers', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};