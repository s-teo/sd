import React from "react";

const CombinedScheduleList = ({ items }) => {
  if (!items.length) return <p>Расписание пусто.</p>;

  return (
    <div className="combined-schedule">
      <h2>Расписание</h2>
      <ul>
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            <strong>{new Date(item.start_time).toLocaleString()}</strong> —{" "}
            {item.type === "appointment" ? (
              <>
                Пациент: {item.patient_name}
                {item.reason && ` — Причина: ${item.reason}`}
                <br />
                Телефон: {item.phone}
              </>
            ) : (
              <>Свободный слот</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CombinedScheduleList;
