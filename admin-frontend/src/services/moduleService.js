import api from './api';

export const getModules = async (search = '', page = 1, limit = 10) => {
  try {
    const response = await api.get('/modules', {
      params: { search, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getModuleById = async (id) => {
  try {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createModule = async (moduleData) => {
  try {
    const response = await api.post('/modules', moduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateModule = async (id, moduleData) => {
  try {
    const response = await api.put(`/modules/${id}`, moduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteModule = async (id) => {
  try {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getModulesByFiliere = async (filiereId) => {
  try {
    const response = await api.get(`/filieres/${filiereId}/modules`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// import api from './api';

// export const getModules = async (page = 1, limit = 10, search = '', filiereId = '') => {
//   try {
//     const response = await api.get('/modules', {
//       params: { page, limit, search, filiereId }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getModuleById = async (id) => {
//   try {
//     const response = await api.get(`/modules/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createModule = async (moduleData) => {
//   try {
//     const response = await api.post('/modules', moduleData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateModule = async (id, moduleData) => {
//   try {
//     const response = await api.put(`/modules/${id}`, moduleData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteModule = async (id) => {
//   try {
//     const response = await api.delete(`/modules/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getModulesByFiliere = async (filiereId) => {
//   try {
//     const response = await api.get(`/filieres/${filiereId}/modules`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };