import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@api/auth";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    is_active: true, // добавим это поле
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProfile();
        setFormData(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Ошибка при обновлении профиля", err);
    }
  };

  const showEmailWarning = formData.email && formData.is_email_verified === false;
  return (
    <div className="profile-container">
      <h2>Профиль</h2>

      {showEmailWarning && (
        <div className="email-warning">
          <p>
            <strong>Внимание!</strong> Ваш email <b>{formData.email}</b> не подтверждён.
            Пожалуйста, проверьте почту и перейдите по ссылке для активации.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input name="username" value={formData.username} onChange={handleChange} />
        <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Имя" />
        <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Фамилия" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        
        <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Телефон" />
        <button>Сохранить</button>
        {success && <div className="success-msg">Профиль обновлён!</div>}
      </form>
    </div>
  );
};

export default Profile;
