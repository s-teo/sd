import React from 'react';
import './DoctorHomeCard.css';
import StarRating from '../ui/StarRating';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor, isSelected, onClick }) => {
  return (
    <div
      className={`doctor-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(doctor)}
    >
      <img src={doctor.doctor_image} alt={doctor.full_name} />
      <h3>{doctor.full_name}</h3>
      <p>{doctor.specialty}</p>
      <div style={{ marginTop: 8 }}>
        {doctor.average_rating ? (
          <StarRating rating={Math.round(doctor.average_rating)} />
        ) : (
          <span style={{ color: '#aaa' }}>нет данных</span>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
