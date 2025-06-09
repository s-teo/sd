import React, { useEffect, useState } from "react";
import { getAppointments, cancelAppointment } from "@api/appointments";
import { getDoctors } from "@api/doctors";
import AppointmentHistory from "./AppointmentHistory";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appsData, doctorsData] = await Promise.all([
          getAppointments(),
          getDoctors(),
        ]);
        setAppointments(appsData);

        const doctorsMap = {};
        doctorsData.forEach((doc) => {
          doctorsMap[doc.id] = doc;
        });
        setDoctors(doctorsMap);
        setLoading(false);
      } catch (err) {
        setError("Ошибка загрузки данных");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      await cancelAppointment(appointmentId);
      setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
    } catch (err) {
      alert("Ошибка отмены записи");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p className="my-appointments-loading">Загрузка...</p>;
  if (error) return <p className="my-appointments-error">{error}</p>;

  // Разделяем по статусу и сортируем по времени (start_time)
  const activeAppointments = appointments
    .filter((app) => app.status !== "completed")
    .sort(
      (a, b) =>
        new Date(a.time_slot_data?.start_time) -
        new Date(b.time_slot_data?.start_time)
    );

  const completedAppointments = appointments
    .filter((app) => app.status === "completed")
    .sort(
      (a, b) =>
        new Date(a.time_slot_data?.start_time) -
        new Date(b.time_slot_data?.start_time)
    );

  const statusTranslations = {
    scheduled: "Запланировано",
    cancelled: "Отменено",
    completed: "Завершено",
  };

  function formatPhoneNumber(phone) {
    if (!phone) return "-";

    // Удалим всё, кроме цифр и плюса
    const cleaned = phone.replace(/\D/g, "");

    // Обрабатываем номер в формате +996xxxxxxxxx (12 цифр, включая код страны)
    const match = cleaned.match(/^996(\d{3})(\d{3})(\d{3})$/);

    if (match) {
      return `+996 (${match[1]}) ${match[2]}-${match[3]}`;
    }

    // Если начиналось с + (например, +996777777777), обрежем + и попробуем снова
    const withPlus = phone.startsWith("+") ? phone.slice(1) : phone;

    const fallbackMatch = withPlus.match(/^996(\d{3})(\d{3})(\d{3})$/);
    if (fallbackMatch) {
      return `+996 (${fallbackMatch[1]}) ${fallbackMatch[2]}-${fallbackMatch[3]}`;
    }

    return phone; // если не подходит — вернём как есть
  }

  return (
    <div className="my-appointments-container">
      <h2>Мои записи</h2>
      {activeAppointments.length === 0 ? (
        <p className="my-appointments-empty">Записей нет</p>
      ) : (
        <ul className="my-appointments-list">
          {activeAppointments.map((app) => {
            let statusClass = "other";
            if (app.status === "scheduled") statusClass = "scheduled";
            else if (app.status === "cancelled") statusClass = "cancelled";

            return (
              <li key={app.id} className="my-appointments-item">
                <div className="my-appointments-info">
                  <p>
                    <strong>Врач:</strong>{" "}
                    {app.doctor ? app.doctor.full_name : "Загрузка..."}
                  </p>
                  <div>
                    <strong>Специальность:</strong>{" "}
                    {app.doctor.specialty.map((spec) => spec.name).join(", ")}
                  </div>

                  <p>
                    <strong>Номер врача:</strong>{" "}
                    {formatPhoneNumber(app.doctor?.phone)}
                  </p>
                  <p>
                    <strong>Статус:</strong>{" "}
                    <span className={`my-appointments-status ${statusClass}`}>
                      {statusTranslations[app.status] || app.status}
                    </span>
                  </p>
                  <p>
                    <strong>Дата и время:</strong>{" "}
                    {app.time_slot_data
                      ? new Date(app.time_slot_data.start_time).toLocaleString(
                          "ru-RU",
                          {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Нет данных"}
                  </p>
                </div>
                <div className="my-appointments-button">
                  {app.status === "scheduled" && (
                    <button
                      onClick={() => handleCancel(app.id)}
                      disabled={cancellingId === app.id}
                    >
                      {cancellingId === app.id ? "Отмена..." : "Отменить"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Вывод истории завершённых записей */}
      <AppointmentHistory
        appointments={completedAppointments}
        doctors={doctors}
      />
    </div>
  );
};

export default MyAppointments;
