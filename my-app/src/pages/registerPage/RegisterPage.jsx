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
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});

  const usernameRegex = /^[a-zA-Z_@.+-][\w.@+-]*$/;
  const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/;

  // Функция для валидации одного поля
  const validateField = (name, value) => {
    let errorMsgs = [];

    if (name === "username") {
      if (!usernameRegex.test(value)) {
        errorMsgs.push(
          "Имя пользователя должно начинаться с буквы или символа (_ @ . + -) и содержать только буквы, цифры и символы . _ @ + -"
        );
      }
      if (value.length > 150) {
        errorMsgs.push("Имя пользователя должно быть не длиннее 150 символов.");
      }
    }

    if (name === "first_name") {
      if (value && !nameRegex.test(value)) {
        errorMsgs.push("Имя должно содержать только буквы без пробелов и символов.");
      }
    }

    if (name === "last_name") {
      if (value && !nameRegex.test(value)) {
        errorMsgs.push("Фамилия должна содержать только буквы без пробелов и символов.");
      }
    }

    if (name === "passwordConfirm") {
      if (value !== formData.password) {
        errorMsgs.push("Пароли не совпадают");
      }
    }

    return errorMsgs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Обновляем форму
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Валидация конкретного поля
    const fieldErrors = validateField(name, value);

    // Для пароля подтверждения ещё надо проверить текущий пароль
    if (name === "password" && formData.passwordConfirm) {
      const confirmErrors = validateField("passwordConfirm", formData.passwordConfirm);
      setErrors((prev) => ({
        ...prev,
        password: fieldErrors,
        passwordConfirm: confirmErrors,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors.length > 0 ? fieldErrors : undefined,
    }));
  };

  // Для PhoneInput валидацию вызываем отдельно (onChange даёт сразу номер)
  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }));

    // Простая проверка на пустоту (или можно более сложную)
    if (!phone || phone.length < 5) {
      setErrors((prev) => ({
        ...prev,
        phone: ["Введите корректный номер телефона."],
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Вся валидация при отправке (на всякий случай)
    let validationErrors = {};

    // Проверяем все поля, вызывая validateField
    for (const [key, value] of Object.entries(formData)) {
      const errs = validateField(key, value);
      if (errs.length > 0) validationErrors[key] = errs;
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
        phone: "+" + formData.phone,
        password: formData.password,
      });

      navigate("/verify-phone", {
        state: { phone: "+" + formData.phone, flashMessage: "Подтвердите номер телефона, Пожалуйста!" },
      });
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
          onChange={handlePhoneChange}
          inputProps={{
            name: "phone",
            required: true,
          }}
          inputStyle={{ width: "100%" }}
          specialLabel={null}
          required
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
            {errors.passwordConfirm &&
              errors.passwordConfirm.map((msg, i) => (
                <div className="error" key={i}>
                  {msg}
                </div>
              ))}
          </div>
        </div>

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

// navigate("/verify-phone", { state: { flashMessage: "Регистрация прошла успешно!" } });
