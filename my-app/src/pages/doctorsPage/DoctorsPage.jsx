import React, { useEffect, useState } from 'react';
import { getDoctors, getDoctorReviews, createOrUpdateReview } from '../../api/doctors';
import DoctorCard from '../../components/DoctorCard/DoctorCard';
import './DoctorsPage.css';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctor(data[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке докторов:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;

    const loadReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await getDoctorReviews(selectedDoctor.id);
        setReviews(data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, [selectedDoctor]);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setSubmittingReview(true);

    try {
      await createOrUpdateReview({
        doctor: selectedDoctor.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      const updatedReviews = await getDoctorReviews(selectedDoctor.id);
      setReviews(updatedReviews);
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      alert('Ошибка при отправке отзыва');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingDoctors) return <p>Загрузка врачей...</p>;

  return (
    <div className="doctors-page">
      <h1>Наши врачи</h1>

      <div className="doctor-list">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            isSelected={selectedDoctor?.id === doctor.id}
            onClick={handleDoctorClick}
          />
        ))}
      </div>

      {selectedDoctor && (
        <section className="reviews-section">
          <h2>Отзывы о Dr. {selectedDoctor.full_name}</h2>

          {loadingReviews ? (
            <p>Загрузка отзывов...</p>
          ) : reviews.length === 0 ? (
            <p>Пока нет отзывов.</p>
          ) : (
            <ul className="reviews-list">
              {reviews.map((review) => (
                <li key={review.id} className="review-item">
                  <strong>{review.patient_name}</strong> —{' '}
                  <small>{new Date(review.created_at).toLocaleDateString()}</small>
                  <p>Рейтинг: {review.rating} / 5</p>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          )}

          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label htmlFor="rating">Оценка (1–5):</label>
            <select
              id="rating"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              required
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>

            <label htmlFor="comment">Комментарий:</label>
            <textarea
              id="comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Напишите отзыв (необязательно)"
            />

            <button type="submit" disabled={submittingReview}>
              {submittingReview ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default DoctorsPage;
