import api from './api';

export const getExams = async (search = '', page = 1, limit = 10) => {
  try {
    const response = await api.get('/exams', {
      params: { search, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExamById = async (id) => {
  try {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await api.post('/exams', examData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExam = async (id, examData) => {
  try {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExam = async (id) => {
  try {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExamsByElement = async (elementId) => {
  try {
    const response = await api.get(`/elements/${elementId}/exams`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExamResults = async (examId) => {
  try {
    const response = await api.get(`/exams/${examId}/results`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// import api from './api';

// export const getExams = async (page = 1, limit = 10, search = '', filiereId = '') => {
//   try {
//     const response = await api.get('/exams', {
//       params: { page, limit, search, filiereId }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getExamById = async (id) => {
//   try {
//     const response = await api.get(`/exams/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createExam = async (examData) => {
//   try {
//     const response = await api.post('/exams', examData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateExam = async (id, examData) => {
//   try {
//     const response = await api.put(`/exams/${id}`, examData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteExam = async (id) => {
//   try {
//     const response = await api.delete(`/exams/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getExamsByFiliere = async (filiereId) => {
//   try {
//     const response = await api.get(`/filieres/${filiereId}/exams`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };