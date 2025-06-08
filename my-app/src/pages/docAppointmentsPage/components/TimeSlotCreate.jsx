import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import { createTimeSlot } from '../../../api/doctors';
import './TimeSlotCreate.css';

registerLocale('ru', ru);

const TimeSlotCreate = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await createTimeSlot({ start_time: startDate.toISOString() });
      setSuccess('Тайм-слот успешно создан');
    } catch (err) {
      setError('Ошибка при создании тайм-слота');
    }
  };

  const minTime = new Date();
  minTime.setHours(8, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(20, 0, 0, 0);

  // Функция для фильтрации дат — true, если это не суббота (6) и не воскресенье (0)
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <div className="timeslot-create-container">
      <h2>Создание тайм-слота</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date-picker">Дата и время:</label>
        <DatePicker
          id="date-picker"
          selected={startDate}
          onChange={setStartDate}
          showTimeSelect
          timeIntervals={60}
          dateFormat="PPp"
          locale="ru"
          minTime={minTime}
          maxTime={maxTime}
          filterDate={isWeekday}
          placeholderText="Выберите дату и время"
        />
        <button type="submit">Создать</button>
      </form>
      {success && <p className="message success">{success}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default TimeSlotCreate;
