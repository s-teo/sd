import React, { useEffect, useState } from "react";
import { getDoctors, getDoctorReviews } from "../../api/doctors";
import DoctorCard from "../../components/DoctorHomeCard/DoctorHomeCard";
import StarRating from "../../components/ui/StarRating";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoadingDoctors(true);
        const data = await getDoctors();
        setDoctors(data);
        // if (data.length > 0) {
        //   setSelectedDoctor(data[0]);
        // }
      } catch (err) {
        console.error("Ошибка при загрузке врачей", err);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    async function fetchReviews() {
      if (!selectedDoctor) {
        setReviews([]);
        return;
      }
      try {
        setLoadingReviews(true);
        const data = await getDoctorReviews(selectedDoctor.id);
        setReviews(data);
      } catch (err) {
        console.error("Ошибка при загрузке отзывов", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [selectedDoctor]);

  const handleBooking = (e) => {
    navigate(`/doctors`);
  };
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Добро пожаловать на MedBooking</h1>
          <p>Запишитесь к врачу быстро и удобно онлайн</p>
          <button
            className="btn-primary"
            onClick={() => {
              const firstDoctor = doctors[0];
              if (firstDoctor) setSelectedDoctor(firstDoctor);
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            Записаться сейчас
          </button>
        </div>
      </section>

      <section className="how-it-works">
        <h2>Как работает MedBooking</h2>
        <div className="steps-list">
          <div className="step-item">
            <h3>1. Выберите врача</h3>
            <p>Просмотрите список специалистов, изучите их профили и отзывы.</p>
          </div>
          <div className="step-item">
            <h3>2. Запишитесь онлайн</h3>
            <p>
              Выберите удобное время и оформите запись без звонков и очередей.
            </p>
          </div>
          <div className="step-item">
            <h3>3. Посетите приём</h3>
            <p>
              Приходите на приём и получайте качественную медицинскую помощь.
            </p>
          </div>
        </div>
      </section>

      <section className="advantages">
        <h2>Почему выбирают нас</h2>
        <div className="advantages-list">
          <div className="advantage-item">
            <span role="img" aria-label="clock" className="advantage-icon">
              ⏰
            </span>
            <h3>Экономия времени</h3>
            <p>Запись к врачу за пару кликов без ожидания в очередях</p>
          </div>
          <div className="advantage-item">
            <span role="img" aria-label="shield" className="advantage-icon">
              🛡️
            </span>
            <h3>Надежность</h3>
            <p>Проверенные специалисты и реальные отзывы пациентов</p>
          </div>
          <div className="advantage-item">
            <span role="img" aria-label="smartphone" className="advantage-icon">
              📱
            </span>
            <h3>Удобство</h3>
            <p>Запись и управление приёмами с любого устройства</p>
          </div>
        </div>
      </section>

      <section className="doctors">
        <h2>Наши специалисты</h2>
        {loadingDoctors ? (
          <p>Загрузка врачей...</p>
        ) : (
          <div className="doctors-list">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                isSelected={selectedDoctor?.id === doc.id}
                onClick={setSelectedDoctor}
              />
            ))}
          </div>
        )}
      </section>

    

      <section className="cta-bottom">
        <h2>Готовы записаться на приём?</h2>
        <button className="btn-primary" onClick={handleBooking}>
          Записаться сейчас
        </button>
      </section>
    </>
  );
};

export default HomePage;
