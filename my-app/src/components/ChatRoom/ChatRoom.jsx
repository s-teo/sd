import { useEffect, useState, useRef } from "react";
import chatAPI from "../../api/chat";
import "./ChatRoom.css";
import { useAuth } from "../../context/AuthContext";

export default function ChatRoom({ receiverId, fullName, avatar }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (receiverId) {
      loadMessages();
    }
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(receiverId);
      setMessages(response);
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      try {
        await chatAPI.sendMessage(receiverId, input);
        await loadMessages();
        setInput("");
      } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // ✅ Логика для проверки аватарки
  const isAvatarMissing = !avatar || avatar.includes("default.png");

  return (
    <div className="chat-room-wrapper">
      <div className="chat-header">
        {avatar && !isAvatarMissing ? (
          <img
            src={avatar}
            alt={fullName}
            className="chat-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        ) : (
          <div className="chat-avatar placeholder">П</div>
        )}

        <span className="chat-header-username">
          {fullName} {isAvatarMissing && <span className="patient-label">Пациент</span>}
        </span>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.user.id === user.id ? "own-message" : "received-message"
            }`}
          >
            <div className="message-text">{msg.message}</div>
            <div className="message-meta">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          className="chat-input"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="send-button">
          Отправить
        </button>
      </div>
    </div>
  );
}
