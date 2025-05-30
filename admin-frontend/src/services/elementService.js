import api from './api';

export const getElements = async (search = '', page = 1, limit = 10) => {
  try {
    const response = await api.get('/elements', {
      params: { search, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getElementById = async (id) => {
  try {
    const response = await api.get(`/elements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createElement = async (elementData) => {
  try {
    const response = await api.post('/elements', elementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateElement = async (id, elementData) => {
  try {
    const response = await api.put(`/elements/${id}`, elementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteElement = async (id) => {
  try {
    const response = await api.delete(`/elements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getElementsByModule = async (moduleId) => {
  try {
    const response = await api.get(`/modules/${moduleId}/elements`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// import api from './api';

// export const getElements = async (page = 1, limit = 10, search = '', moduleId = '') => {
//   try {
//     const response = await api.get('/elements', {
//       params: { page, limit, search, moduleId }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getElementById = async (id) => {
//   try {
//     const response = await api.get(`/elements/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createElement = async (elementData) => {
//   try {
//     const response = await api.post('/elements', elementData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateElement = async (id, elementData) => {
//   try {
//     const response = await api.put(`/elements/${id}`, elementData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteElement = async (id) => {
//   try {
//     const response = await api.delete(`/elements/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getElementsByModule = async (moduleId) => {
//   try {
//     const response = await api.get(`/modules/${moduleId}/elements`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };