import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import HomePage from "@pages/HomePage/HomePage";
import Login from "./pages/loginPage/LoginPage";
import Register from "./pages/registerPage/RegisterPage";
import PrivateRoute from "./routes/PrivateRoute";
import DoctorRoute from "./routes/DoctorsRoute";
import Profile from "./pages/profilePage/ProfilePage";
import CreateAppointment from "./components/CreateAppointment/CreateAppointment";
import Doctors from "./pages/DoctorsPage/DoctorsPage";
import PhoneVerification from "@pages/PhoneVerification/PhoneVerification";
import DocAppointments from '@pages/docAppointmentsPage/DocAppointmentsPage';
import MessagesPage from "./pages/Messages/Messages"; // добавляем MessagesPage
import About from "./pages/AboutUsPage/AboutUsPage"; // добавляем MessagesPage

function AppRoutes() {
  const { user, token } = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-phone" element={<PhoneVerification />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About   />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/appoinmetns"
          element={
            <DoctorRoute>
              <DocAppointments />
            </DoctorRoute>
          }
        />
        <Route
          path="/appointments/create"
          element={
            <PrivateRoute>
              <CreateAppointment />
            </PrivateRoute>
          }
        />

        {/* ✅ Добавляем маршрут для сообщений */}
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagesPage token={token} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
