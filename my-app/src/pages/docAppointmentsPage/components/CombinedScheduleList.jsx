import React from "react";
import "./CombinedScheduleList.css";

const CombinedScheduleList = ({ items }) => {
  const now = new Date();

  // Оставляем только те, что начинаются в будущем
  const upcomingItems = items.filter(item => new Date(item.start_time) > now);

  if (!upcomingItems.length) return <p>Ближайших записей нет.</p>;

  return (
    <div className="combined-schedule">
      <h2 className="schedule-title">Сессии</h2>
      <div className="schedule-list">
        {upcomingItems.map((item) => (
          <div className={`schedule-card ${item.type}`} key={`${item.type}-${item.id}`}>
            <div className="schedule-time">
              {new Date(item.start_time).toLocaleString()}
            </div>
            <div className="schedule-content">
              {item.type === "appointment" ? (
                <>
                  <div><strong>Пациент:</strong> {item.patient_name}</div>
                  {item.reason && <div><strong>Причина:</strong> {item.reason}</div>}
                  <div><strong>Телефон:</strong> {item.phone}</div>
                </>
              ) : (
                <div className="free-slot">Свободная сессия</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombinedScheduleList;
