import api from './axios'; // твой настроенный axios клиент с авторизацией

// Получить список записей текущего пользователя (только с status='scheduled')
export const getAppointments = async () => {
  const response = await api.get('/appointments/');
  return response.data;
};

// Создать новую запись на приём
// data: { doctor: id, time_slot: id, reason?: string }
export const createAppointment = async (data) => {
  const response = await api.post('/appointments/', data);
  return response.data;
};

// Отменить запись (обновить статус на 'cancelled')
export const cancelAppointment = async (appointmentId) => {
  const response = await api.patch(`/appointments/${appointmentId}/`, { status: 'cancelled' });
  return response.data;
};

