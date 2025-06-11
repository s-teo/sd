import React, { useEffect, useState } from "react";
import { getDoctors, getDoctorReviews } from "../../api/doctors";
import DoctorHomeCard from "../../components/DoctorHomeCard/DoctorHomeCard";
import StarRating from "../../components/ui/StarRating";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

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
              <DoctorHomeCard
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
      <section className="latest-news">
        <h2>Новости и полезные статьи</h2>
        <div className="news-list">
          <div className="news-item">
            {/* Изображение-заглушка. Можете использовать сервисы вроде Placeholder.com или Unsplash. */}
            <img
              src="https://mgppu.ru/files/galleries/photos/8e552a60eb42f98a3fc00c3051c89079.png"
              alt="Как поддерживать иммунитет весной"
            />
            <h3>
              <a
                href="https://mgppu.ru/news/10430"
                target="_blank"
                rel="noopener noreferrer"
              >
                Как поддерживать иммунитет весной
              </a>
            </h3>
            <p>
              Узнайте о простых шагах, которые помогут укрепить ваш иммунитет в
              сезон простуд и аллергии...
            </p>
            <span className="news-date">10 июня 2025</span>
          </div>
          <div className="news-item">
            <img
              src="https://dpoaps.ru/blog/wp-content/uploads/2023/07/321-1536x838.jpg"
              alt="Новые подходы в лечении хронических заболеваний"
            />
            <h3>
              <a
                href="https://dpoaps.ru/blog/sekrety-effektivnogo-lecheniya-otkrojte-kljuchi-k-uspehu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Новые подходы в лечении хронических заболеваний
              </a>
            </h3>
            <p>
              Обзор последних исследований и методов, улучшающих качество жизни
              пациентов...
            </p>
            <span className="news-date">5 июня 2025</span>
          </div>
          <div className="news-item">
            <img
              src="https://worldclasskhv.ru/upload/medialibrary/61d/61d6cd5a638370684e582c79d2bfca95.jpg"
              alt="Здоровое питание: мифы и реальность"
            />
            <h3>
              <a
                href="https://worldclasskhv.ru/news/stil-zhizni/10-mifov-o-pravilnom-pitanii/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Здоровое питание: мифы и реальность
              </a>
            </h3>
            <p>
              Разбираем популярные заблуждения о правильном питании и даём
              практические советы...
            </p>
            <span className="news-date">1 июня 2025</span>
          </div>
          {/* Вы можете добавить больше таких блоков */}
        </div>
        {/* Кнопка, ведущая на "все новости", которую пока можно сделать неактивной или вести на заглушку */}
        <button
          className="btn-secondary"
          onClick={() => alert("Раздел новостей скоро будет доступен!")}
        >
          Все новости
        </button>
      </section>
    </>
  );
};

export default HomePage;
