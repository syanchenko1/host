import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  return (
    <div className="main__content">
      <button className="main__sbar">
        <Link to="/sbar">Перейти на страницу СБАР</Link>
      </button>
    </div>
  );
};

export default Main;
