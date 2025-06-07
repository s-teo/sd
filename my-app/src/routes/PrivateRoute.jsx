import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ 
          from: location.pathname,
          flashMessage: "Пожалуйста, войдите или зарегистрируйтесь"
        }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
