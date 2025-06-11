import React from "react";
import "./DoctorCard.css";
import StarRating from "../ui/StarRating";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor, isSelected, onClick }) => {
  const navigate = useNavigate();

  const handleBooking = (e) => {
    e.stopPropagation();
    navigate(`/appointments/create?doctor=${doctor.id}`);
  };

  const handleStartChat = (e) => {
    e.stopPropagation();
    navigate(`/messages?doctorId=${doctor.id}`);
  };

  return (
    <div
      className={`doctor-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(doctor)}
    >
      <img
        src={doctor?.doctor_image || "/default-doctor.jpg"}
        alt={doctor?.full_name || "Врач"}
        className="doctor-image"
      />
      <h3 className="doctor-name">{doctor?.full_name || "Неизвестный врач"}</h3>

      <div className="doctor-specialty">
        {Array.isArray(doctor?.specialty)
          ? doctor.specialty.map((spec) => spec.name).join(", ")
          : "Специальность не указана"}
      </div>

      <div className="doctor-rating">
        {doctor?.average_rating ? (
          <StarRating rating={Math.round(doctor.average_rating)} />
        ) : (
          <span className="no-reviews">Нет отзывов</span>
        )}
      </div>

      <div className="doctor-card-buttons">
        <button onClick={handleBooking} className="doctor-card-button">
          Записаться
        </button>
        <button
          onClick={handleStartChat}
          className="doctor-card-button chat-button"
        >
          Написать
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
