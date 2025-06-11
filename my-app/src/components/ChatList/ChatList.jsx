import { useEffect, useState } from "react";
import chatAPI from "../../api/chat";
import "./ChatList.css";

export default function ChatList({ onSelectUser }) {
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDialogs();
  }, []);

  const loadDialogs = async () => {
    try {
      const response = await chatAPI.getDialogs();
      setDialogs(response);
    } catch (error) {
      console.error("Ошибка загрузки диалогов:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-list">
      <h2 className="chat-list-title">Диалоги</h2>
      <ul className="chat-list-items">
        {loading ? (
          <li className="chat-list-loading">Загрузка...</li>
        ) : dialogs.length > 0 ? (
          dialogs.map((dialog) => {
            const hasAvatar =
              dialog.doctor_image &&
              dialog.doctor_image !== null &&
              !dialog.doctor_image.includes("default.png");

            return (
              <li
                key={dialog.user_id}
                onClick={() =>
                  onSelectUser(dialog.user_id, dialog.full_name, dialog.doctor_image)
                }
                className={`chat-list-item ${hasAvatar ? "doctor-chat" : "patient-chat"}`}
              >
                {hasAvatar ? (
                  <img
                    src={dialog.doctor_image}
                    alt={dialog.full_name}
                    className="chat-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="chat-avatar placeholder">П</div>
                )}
                <div className="chat-list-content">
                  <div className="chat-list-username">
                    {dialog.full_name} {!hasAvatar && <span className="patient-label">Пациент</span>}
                  </div>
                  <div className="chat-list-last-message">{dialog.last_message}</div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="chat-list-empty">Нет доступных диалогов</li>
        )}
      </ul>
    </div>
  );
}
