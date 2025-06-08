import React from "react";
import "./MyAppointments.css";

const statusTranslations = {
  scheduled: "Запланировано",
  cancelled: "Отменено",
  completed: "Завершено",
};

const AppointmentHistory = ({ appointments, doctors }) => {
  if (appointments.length === 0) {
    return <p className="my-appointments-empty">История записей пуста</p>;
  }

  return (
    <div className="my-appointments-history">
      <h3>История записей</h3>
      <ul className="my-appointments-list">
        {appointments.map((app) => {
          return (
            <li key={app.id} className="my-appointments-item">
              <div className="my-appointments-info">
                <p>
                  <strong>Врач:</strong> {app.doctor ? app.doctor.full_name : "Загрузка..."}
                </p>
                <p>
                  <strong>Специальность:</strong> {app.doctor?.specialty || "-"}
                </p>
                <p>
                  <strong>Статус:</strong>{" "}
                  <span className={`my-appointments-status completed`}>
                    {statusTranslations[app.status] || app.status}
                  </span>
                </p>
                <p>
                  <strong>Дата и время:</strong>{" "}
                  {app.time_slot_data ? (
                    new Date(app.time_slot_data.start_time).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    "Нет данных"
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AppointmentHistory;
