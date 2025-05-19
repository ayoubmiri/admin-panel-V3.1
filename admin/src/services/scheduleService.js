import api from './api';

export const getSchedule = async (programId, academicYear) => {
  try {
    const response = await api.get('/schedule', {
      params: { programId, academicYear }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getScheduleById = async (id) => {
  try {
    const response = await api.get(`/schedule/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('/schedule', scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await api.put(`/schedule/${id}`, scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportSchedule = async (programId, academicYear) => {
  try {
    const response = await api.get('/schedule/export', {
      params: { programId, academicYear },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};