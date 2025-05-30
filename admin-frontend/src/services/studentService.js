import api from './api';

export const getStudents = async (search = '', page = 1, limit = 10) => {
  try {
    const response = await api.get('/students', {
      params: { search, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/students', studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentsByFiliere = async (filiereId) => {
  try {
    const response = await api.get(`/filieres/${filiereId}/students`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentsByClass = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/students`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



// import api from './api';

// export const getStudents = async (search = '', page = 1, limit = 10) => {
//   try {
//     const response = await api.get('/students', {
//       params: { search, page, limit }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getStudentById = async (id) => {
//   try {
//     const response = await api.get(`/students/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createStudent = async (studentData) => {
//   try {
//     const response = await api.post('/students', studentData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateStudent = async (id, studentData) => {
//   try {
//     const response = await api.put(`/students/${id}`, studentData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteStudent = async (id) => {
//   try {
//     const response = await api.delete(`/students/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getStudentsByFiliere = async (filiereId) => {
//   try {
//     const response = await api.get(`/filieres/${filiereId}/students`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getStudentsByClass = async (classId) => {
//   try {
//     const response = await api.get(`/classes/${classId}/students`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };




// import api from './api';

// export const getStudents = async (page = 1, limit = 10, search = '') => {
//   try {
//     const response = await api.get('/students', {
//       params: { page, limit, search }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getStudentById = async (id) => {
//   try {
//     const response = await api.get(`/students/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createStudent = async (studentData) => {
//   try {
//     const response = await api.post('/students', studentData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateStudent = async (id, studentData) => {
//   try {
//     const response = await api.put(`/students/${id}`, studentData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteStudent = async (id) => {
//   try {
//     const response = await api.delete(`/students/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };