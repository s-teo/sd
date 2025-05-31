import api from './axios'; // твой настроенный axios клиент с авторизацией
// Получить список врачей
export const getDoctors = async () => {
  const response = await api.get('/doctors/');
  return response.data;
};

// Получить доступные слоты для врача
export const getAvailableTimeSlots = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/slots/`);
  return response.data;
};

// Получить отзывы о враче
export const getDoctorReviews = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/reviews/`);
  return response.data;
};

// Создать или обновить отзыв о враче
// data: { doctor: id, rating: number, comment?: string }
export const createOrUpdateReview = async (data) => {
  const response = await api.post('/doctors/reviews/', data);
  return response.data;
};


export const createTimeSlot = async (data) => {
  const response = await api.post('/doctors/timeslots/create/', data);
  return response.data;
};