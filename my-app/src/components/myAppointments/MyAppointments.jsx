import React, { useEffect, useState } from 'react';
import { getAppointments, cancelAppointment } from '../../api/appointments';
import { getDoctors } from '../../api/doctors';
import './MyAppointments.css';

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
          getDoctors()
        ]);
        setAppointments(appsData);

        const doctorsMap = {};
        doctorsData.forEach(doc => {
          doctorsMap[doc.id] = doc;
        });
        setDoctors(doctorsMap);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      await cancelAppointment(appointmentId);
      setAppointments((prev) => prev.filter(app => app.id !== appointmentId));
    } catch (err) {
      alert('Ошибка отмены записи');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p className="my-appointments-loading">Загрузка...</p>;
  if (error) return <p className="my-appointments-error">{error}</p>;

  return (
    <div className="my-appointments-container">
      <h2>Мои записи</h2>

      {appointments.length === 0 ? (
        <p className="my-appointments-empty">Записей нет</p>
      ) : (
        <ul className="my-appointments-list">
          {appointments.map(app => {
            const doctor = doctors[app.doctor];
            let statusClass = 'other';
            if (app.status === 'scheduled') statusClass = 'scheduled';
            else if (app.status === 'cancelled') statusClass = 'cancelled';

            return (
              <li key={app.id} className="my-appointments-item">
                <div className="my-appointments-info">
                  <p><strong>Врач:</strong> {doctor ? doctor.full_name : 'Загрузка...'}</p>
                  <p><strong>Специальность:</strong> {doctor?.specialty || '-'}</p>
                  <p><strong>Статус:</strong> <span className={`my-appointments-status ${statusClass}`}>{app.status}</span></p>
                  <p><strong>Дата и время:</strong> {app.time_slot_data ? (
                    <>
                      {new Date(app.time_slot_data.start_time).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  ) : 'Нет данных'}</p>

                </div>
                <div className="my-appointments-button">
                  {app.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancel(app.id)}
                      disabled={cancellingId === app.id}
                    >
                      {cancellingId === app.id ? 'Отмена...' : 'Отменить'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
