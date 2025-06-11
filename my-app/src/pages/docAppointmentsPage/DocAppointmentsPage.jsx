import React, { useEffect, useState } from "react";
import TimeSlotCreate from "./components/TimeSlotCreate";
import CombinedScheduleList from "./components/CombinedScheduleList";
import { getMyTimeSlots, getMyAppointments } from "../../api/doctors";
import "./DocAppointmentsPage.css";


const DocAppointmentsPage = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoadingSlots(true);
    setLoadingAppointments(true);
    setError(null);
    try {
      const slotsData = await getMyTimeSlots();
      setTimeSlots(slotsData);
      setLoadingSlots(false);

      const appointmentsData = await getMyAppointments();
      setAppointments(appointmentsData);
      setLoadingAppointments(false);
    } catch (err) {
      setError("Ошибка загрузки данных");
      setLoadingSlots(false);
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Объединяем тайм-слоты и записи в один отсортированный список по времени
  const mergeSlotsAndAppointments = (slots, appointments) => {
    const combined = [];

    appointments.forEach((a) => {
      if (a.time_slot_data && a.time_slot_data.start_time) {
        combined.push({
          id: a.id,
          type: "appointment",
          start_time: a.time_slot_data.start_time,
          patient_name: a.patient.full_name,
          phone: a.patient.phone,
          reason: a.reason || null,
          timeSlotId: a.time_slot_data.id,
          status: a.status,
        });
      }
    });

    slots.forEach((s) => {
      // Проверяем, забронирован ли слот (есть ли запись с таким id time_slot_data.id)
      const isBooked = appointments.some(
        (a) => a.time_slot_data && a.time_slot_data.id === s.id
      );
      if (!isBooked) {
        combined.push({
          id: s.id,
          type: "slot",
          start_time: s.start_time,
        });
      }
    });

    return combined.sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
  };

  const combinedList = mergeSlotsAndAppointments(timeSlots, appointments);

  return (
    <div className="appointments-page">
      {error && <div className="alert-error">{error}</div>}
      <CombinedScheduleList items={combinedList} />
      {console.log(combinedList)}

      <TimeSlotCreate onSuccess={fetchData} />

      {/* Если хочешь, можешь вывести объединенный список по времени */}
    </div>
  );
};

export default DocAppointmentsPage;
