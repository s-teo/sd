import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "react-router-dom";
import { createAppointment } from "../../api/appointments";
import { getDoctors, getAvailableTimeSlots } from "../../api/doctors";
import "./CreateAppointment.css";

registerLocale("ru", ru);

const CreateAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorFromParams = searchParams.get("doctor");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorObj, setSelectedDoctorObj] = useState(null);
  const [allSlots, setAllSlots] = useState([]); // ВСЕ слоты
  const [timeSlots, setTimeSlots] = useState([]); // слоты на выбранную дату
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDatesSet, setAvailableDatesSet] = useState(new Set());

  useEffect(() => {
    async function fetchDoctor() {
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

        // Загрузка всех слотов при выборе врача
        const slots = await getAvailableTimeSlots(id);
        setAllSlots(slots);

        // Создаем Set с датами доступных слотов
        const datesSet = new Set(
          slots.map((slot) =>
            new Date(slot.start_time).toISOString().slice(0, 10)
          )
        );
        setAvailableDatesSet(datesSet);
      } catch {
        setError("Ошибка загрузки данных");
      }
    }

    fetchDoctor();
  }, [doctorFromParams]);

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      setSelectedSlot(null);
      return;
    }
    // Фильтруем слоты по выбранной дате
    const filteredSlots = allSlots.filter((slot) => {
      const slotDate = new Date(slot.start_time);
      return (
        slotDate.getFullYear() === selectedDate.getFullYear() &&
        slotDate.getMonth() === selectedDate.getMonth() &&
        slotDate.getDate() === selectedDate.getDate()
      );
    });
    setTimeSlots(filteredSlots);
    setSelectedSlot(null);
  }, [selectedDate, allSlots]);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const dayClassName = (date) => {
    const isoDate = date.toISOString().slice(0, 10);
    if (availableDatesSet.has(isoDate)) {
      return "has-slots"; // CSS-класс для подсветки
    }
    return undefined;
  };

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

      // Обновляем все слоты после записи
      const updatedSlots = await getAvailableTimeSlots(selectedDoctor);
      setAllSlots(updatedSlots);

      // Обновляем Set дат
      const datesSet = new Set(
        updatedSlots.map((slot) =>
          new Date(slot.start_time).toISOString().slice(0, 10)
        )
      );
      setAvailableDatesSet(datesSet);
    } catch {
      setError("Ошибка при создании записи");
    } finally {
      setLoading(false);
    }
  };

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

          <label>Выберите дату:</label>
          <DatePicker
            locale="ru"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={isWeekday}
            minDate={new Date()}
            dateFormat="dd.MM.yyyy"
            dayClassName={dayClassName}
            placeholderText="Выберите дату (пн-пт)"
          />

          <br />

          <label>Доступные слоты:</label>
          {timeSlots.length === 0 ? (
            <p>Нет доступных слотов на выбранную дату</p>
          ) : (
            <div className="slots-list">
              {timeSlots.map((slot) => {
                const start = new Date(slot.start_time).toLocaleTimeString([], {
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
                    {start}
                  </button>
                );
              })}
            </div>
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
