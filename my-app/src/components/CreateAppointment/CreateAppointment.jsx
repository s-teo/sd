import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createAppointment } from "../../api/appointments";
import {
  getDoctors,
  getAvailableTimeSlots,
} from "../../api/doctors";
import "./CreateAppointment.css";

const groupSlotsByDate = (slots) => {
  return slots.reduce((groups, slot) => {
    const date = new Date(slot.start_time).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(slot);
    return groups;
  }, {});
};

const CreateAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorFromParams = searchParams.get("doctor");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorObj, setSelectedDoctorObj] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchDoctorAndSlots() {
      if (!doctorFromParams) {
        setError("Не указан врач");
        return;
      }

      try {
        const docs = await getDoctors();
        const id = parseInt(doctorFromParams);
        const found = docs.find((doc) => doc.id === id);

        if (!found) {
          setError("Врач не найден");
          return;
        }

        setSelectedDoctor(id);
        setSelectedDoctorObj(found);

        const slots = await getAvailableTimeSlots(id);
        setTimeSlots(slots);
        setSelectedSlot(null);
      } catch {
        setError("Ошибка загрузки данных");
      }
    }

    fetchDoctorAndSlots();
  }, [doctorFromParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot) {
      setError("Выберите время");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createAppointment({
        doctor: selectedDoctor,
        time_slot: selectedSlot,
        reason: reason || undefined,
      });
      setSuccess("Запись успешно создана!");
      setSelectedSlot(null);
      setReason("");

      // 🔄 Обновляем список доступных слотов:
      const updatedSlots = await getAvailableTimeSlots(selectedDoctor);
      setTimeSlots(updatedSlots);
    } catch {
      setError("Ошибка при создании записи");
    } finally {
      setLoading(false);
    }
  };

  const groupedSlots = groupSlotsByDate(timeSlots);

  return (
    <div className="appointment-container">
      <h2>Записаться к врачу</h2>
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {selectedDoctorObj && (
        <form onSubmit={handleSubmit}>
          <label>
            Врач:
            <input
              type="text"
              value={`${selectedDoctorObj.full_name} (${selectedDoctorObj.specialty})`}
              readOnly
            />
            <input type="hidden" value={selectedDoctor} name="doctor" />
          </label>

          <br />

          <label>Время:</label>
          {timeSlots.length === 0 ? (
            <p>Нет доступных слотов</p>
          ) : (
            Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date} className="slots-day-group">
                <h4>{date}</h4>
                <div className="slots-list">
                  {slots.map((slot) => {
                    const start = new Date(slot.start_time).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    const end = new Date(slot.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        className={`slot-btn ${
                          selectedSlot === slot.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSlot(slot.id)}
                      >
                        {start} - {end}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          <br />

          <label>
            Причина (необязательно):
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Записываем..." : "Записаться"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateAppointment;
