import React from "react";
import { Link } from "react-router-dom";
import style from "./Admin.module.css"; // Make sure to create this CSS file for styles

const TwoOptionLayout = () => {
  return (
    <div className={style.mainContainer}>
      <h1 className={style.heading}>Choose Your Admin Option</h1>
      <div className={style.options}>
        <Link to="/sale-revenue" className={style.optionCard}>
          <img
            src="/icons/finance.svg"
            alt="Finance Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Omset & Penjualan</span>
        </Link>
        <Link to="/All-Time" className={style.optionCard}>
          <img
            src="/icons/finance.svg"
            alt="Finance Icon"
            className={style.icon}
          />
          <span className={style.optionText}>All Time</span>
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
          <span className={style.optionText}>Penjualan Per Shift</span>
        </Link>
        <Link to="/expense" className={style.optionCard}>
          <img
            src="/icons/spend.svg"
            alt="Spending Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Pengeluaran Per Shift</span>
        </Link>
        <Link to="/MenuFotoEdit" className={style.optionCard}>
          <img
            src="/icons/order-kitchen.svg"
            alt="Spending Icon"
            className={style.icon}
          />
          <span className={style.optionText}>Menu Foto</span>
        </Link>
        <Link to="/Cashflow" className={style.optionCard}>
          <img
            src="/icons/cashflow.svg"
            alt="Cashflow"
            className={style.icon}
          />
          <span className={style.optionText}>Cashflow</span>
        </Link> 
      </div>
    </div>
  );
};

export default TwoOptionLayout;
