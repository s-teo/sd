import api from './axios'; // твой настроенный axios клиент с авторизацией


const chatAPI = {
  async getDialogs() {
    try {
      const response = await api.get("chat/dialogs/");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении диалогов:", error);
      throw error;
    }
  },

  async getMessages(receiverId) {
    try {
      const response = await api.get(`chat/private/${receiverId}/`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
      throw error;
    }
  },

  async sendMessage(receiverId, message) {
    try {
      const response = await api.post(`chat/private/${receiverId}/send/`, { message });
      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      throw error;
    }
  },
};

export default chatAPI; // ✅ Добавь эту строку
