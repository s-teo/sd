import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DoctorRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (!user.is_doctor) return <Navigate to="/forbidden" />;

  return children;
};

export default DoctorRoute;
