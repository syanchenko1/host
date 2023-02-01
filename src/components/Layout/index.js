import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout__container">
      <nav className="layout__header_nav">
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/sbar">СБАР</Link>
        </li>
      </nav>
      <div className="layout__content">{children}</div>
      <div className="layout__footer">footer</div>
    </div>
  );
};

export default Layout;
