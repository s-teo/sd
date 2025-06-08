import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import TimeSlotCreate from '@pages/TimeSlotCreate/TimeSlotCreate';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/verify-phone" element={<PhoneVerification />} />

            {/* Защищенные маршруты */}
            <Route path="doctors" element={<Doctors />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/timeslots/create"
              element={
                <DoctorRoute>
                  <TimeSlotCreate />
                </DoctorRoute>
              }
            />

            {/* Добавляем маршрут для MyAppointments */}
            <Route
              path="/appointments/create"
              element={
                <PrivateRoute>
                  <CreateAppointment />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
