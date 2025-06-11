import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import { getDoctorById } from "../../api/doctors";
import "./Messages.css";

export default function MessagesPage({ token }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const doctorId = searchParams.get("doctorId");
    if (doctorId) {
      loadDoctorForChat(doctorId);
    }
  }, [searchParams]);

  const loadDoctorForChat = async (doctorId) => {
    try {
      const doctor = await getDoctorById(doctorId);
      if (!doctor || !doctor.user) {
        console.error("Доктор или его пользователь не найдены:", doctor);
        return;
      }

      // Добавим проверку на корректность URL аватара здесь
      const doctorAvatar = doctor.doctor_image || '/default-avatar.png'; // Используем дефолтный аватар, если URL пуст или null

      setSelectedUser({
        receiverId: doctor.user.id,
        fullName: doctor.full_name,
        avatar: doctorAvatar, // Используем проверенный аватар
      });
    } catch (error) {
      console.error("Ошибка загрузки врача:", error);
    }
  };

  const handleSelectUser = (receiverId, fullName, avatar) => {
    // Здесь `avatar` уже приходит из `ChatList`, который тоже должен его проверить
    setSelectedUser({ receiverId, fullName, avatar });
  };

  return (
    <div className="messages-page">
      <div className="chat-list-wrapper">
        <ChatList token={token} onSelectUser={handleSelectUser} />
      </div>

      <div className="chat-room-wrapper">
        {selectedUser ? (
            console.log(selectedUser.avatar),
          <ChatRoom
            token={token}
            receiverId={selectedUser.receiverId}
            fullName={selectedUser.fullName}
            avatar={selectedUser.avatar}
            
          />
        ) : (
          <div className="empty-chat">
            <p>Выберите диалог слева 👈</p>
          </div>
        )}
      </div>
    </div>
  );
}