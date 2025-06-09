import React from "react";
import "./CombinedScheduleList.css"; // подключаем стили

const CombinedScheduleList = ({ items }) => {
  if (!items.length) return <p>Расписание пусто.</p>;

  return (
    <div className="combined-schedule">
      <h2 className="schedule-title">Расписание</h2>
      <div className="schedule-list">
        {items.map((item) => (
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
                <div className="free-slot">Свободный слот</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombinedScheduleList;
