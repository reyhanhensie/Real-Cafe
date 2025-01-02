import React from "react";
import { Link } from "react-router-dom";
import style from "./Finance.module.css"; // Make sure to create this CSS file for styles

const TwoOptionLayout = () => {
  return (
    <div className={style.mainContainer}>
      <h1 className={style.heading}>Choose Your Finance Option</h1>
      <div className={style.options}>
        <Link to="/sale-revenue" className={style.optionCard}>
          <img
            src="/icons/finance.svg"
            alt="Finance Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Omset & Penjualan</span>
        </Link>

        <Link to="/traffic" className={style.optionCard}>
          <img
            src="/icons/finance.svg"
            alt="Finance Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Traffic Menu</span>
        </Link>

        <Link to="/summary" className={style.optionCard}>
          <img
            src="/icons/report.svg"
            alt="Finance Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Laporan Hari Ini</span>
        </Link>
      </div>
    </div>
  );
};

export default TwoOptionLayout;
