import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./RegisterPage.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});

  const usernameRegex = /^[\w.@+-]+$/;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let validationErrors = {};

    if (!usernameRegex.test(formData.username)) {
      validationErrors.username = [
        "Имя пользователя содержит недопустимые символы.",
      ];
    }

    if (formData.username.length > 150) {
      validationErrors.username = [
        ...(validationErrors.username || []),
        "Имя пользователя должно быть не длиннее 150 символов.",
      ];
    }

    if (formData.password !== formData.passwordConfirm) {
      validationErrors.passwordConfirm = ["Пароли не совпадают"];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: "+" + formData.phone, // phone уже без "+", добавляем вручную
        password: formData.password,
      });

      navigate("/login", { state: { flash: "Регистрация прошла успешно!" } });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: ["Ошибка при регистрации. Попробуйте позже."],
        });
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {errors.username &&
          errors.username.map((msg, i) => (
            <div className="error" key={i}>
              {msg}
            </div>
          ))}

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              placeholder="Имя"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {errors.first_name &&
              errors.first_name.map((msg, i) => (
                <div className="error" key={i}>
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="last_name"
              placeholder="Фамилия"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {errors.last_name &&
              errors.last_name.map((msg, i) => (
                <div className="error" key={i}>
                  {msg}
                </div>
              ))}
          </div>
        </div>

        <PhoneInput
          country={"kg"}
          value={formData.phone}
          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
          inputProps={{
            name: "phone",
            required: true,
          }}
          inputStyle={{ width: "100%" }}
          specialLabel={null}
        />
        {errors.phone &&
          errors.phone.map((msg, i) => (
            <div className="error" key={i}>
              {msg}
            </div>
          ))}

        {errors.email &&
          errors.email.map((msg, i) => (
            <div className="error" key={i}>
              {msg}
            </div>
          ))}

        <div className="form-row">
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password &&
              errors.password.map((msg, i) => (
                <div className="error" key={i}>
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Подтвердите пароль"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {errors.passwordConfirm &&
          errors.passwordConfirm.map((msg, i) => (
            <div className="error" key={i}>
              {msg}
            </div>
          ))}

        {errors.non_field_errors &&
          errors.non_field_errors.map((msg, i) => (
            <div className="error" key={i}>
              {msg}
            </div>
          ))}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;
