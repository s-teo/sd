import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import "./Layout.css"; // Подключаем стили

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-main">{children}</main>\
      <Footer />
    </div>
  );
};

export default Layout;
