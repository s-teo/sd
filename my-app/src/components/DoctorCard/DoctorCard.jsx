import React from 'react';
import './DoctorCard.css';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor, isSelected, onClick }) => {
  const navigate = useNavigate();

  const handleBooking = (e) => {
    e.stopPropagation(); // не активирует onClick карточки
    navigate(`/appointments/create?doctor=${doctor.id}`);
  };

  return (
    <div
      className={`doctor-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(doctor)}
    >
      <img src={doctor.doctor_image} alt={doctor.full_name} />
      <h3>{doctor.full_name}</h3>
      <p>{doctor.specialty}</p>
      <p>Рейтинг: {doctor.average_rating ?? 'нет данных'}</p>
      <button onClick={handleBooking}>Записаться</button>
    </div>
  );
};

export default DoctorCard;
