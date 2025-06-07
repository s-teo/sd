import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendVerificationCode, verifyPhoneCode } from "../../api/auth";
import "./PhoneVerification.css";

export default function PhoneVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || "";

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [timer, setTimer] = useState(60);

  const hasSentRef = useRef(false); // ⚠️ защита от двойного вызова

  useEffect(() => {
    if (phone && !hasSentRef.current) {
      hasSentRef.current = true;
      sendCode();
    } else if (!phone) {
      setMessage("Телефон не передан");
    }
  }, [phone]);

  useEffect(() => {
    if (timer > 0 && hasSent) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, hasSent]);

  const sendCode = async () => {
    try {
      setLoading(true);
      const res = await sendVerificationCode(phone);
      setMessage(res.data.message || "Код отправлен на телефон");
      setHasSent(true);
      setTimer(60);
    } catch {
      setMessage("Ошибка при отправке кода");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setMessage("Введите код");
      return;
    }
    try {
      setLoading(true);
      const res = await verifyPhoneCode(phone, code);
      setMessage(res.data.message || "Телефон подтверждён");
      if (res.status === 200) {
        navigate("/login", {
          state: { flashMessage: "Телефон подтверждён успешно" },
        });
      }
    } catch {
      setMessage("Неверный код или ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-verification-container">
      <h2>Подтверждение номера телефона</h2>
      <p>Мы отправили код на номер: {phone}</p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Введите код"
      />

      <button onClick={verifyCode} disabled={loading || !code}>
        Подтвердить
      </button>

      <button onClick={sendCode} disabled={loading || timer > 0}>
        {timer > 0 ? `Повторно через ${timer} сек` : "Отправить код повторно"}
      </button>

      <p className="message">{message}</p>
    </div>
  );
}
