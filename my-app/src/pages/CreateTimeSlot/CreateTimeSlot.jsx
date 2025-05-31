import React, { useState } from 'react';
import { createTimeSlot } from '../../api/appointments';

const CreateTimeSlot = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimeSlot({ start_time: startTime, end_time: endTime });
      setMessage('Слот создан успешно');
    } catch (err) {
      setMessage('Ошибка при создании');
    }
  };

  return (
    <div>
      <h2>Создать слот</h2>
      <form onSubmit={handleSubmit}>
        <label>Начало:</label>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <label>Конец:</label>
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <button type="submit">Создать</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTimeSlot;
