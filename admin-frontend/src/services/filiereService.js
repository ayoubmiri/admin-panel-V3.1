import api from './api';

export const getFilieres = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await api.get('/filieres', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFiliereById = async (id) => {
  try {
    const response = await api.get(`/filieres/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFiliere = async (filiereData) => {
  try {
    const response = await api.post('/filieres', filiereData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFiliere = async (id, filiereData) => {
  try {
    const response = await api.put(`/filieres/${id}`, filiereData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFiliere = async (id) => {
  try {
    const response = await api.delete(`/filieres/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};