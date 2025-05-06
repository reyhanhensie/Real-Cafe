import React from "react";
import { Link } from "react-router-dom";
import style from "./DapurOption.module.css"; // Make sure to create this CSS file for styles

const TwoOptionLayout = () => {
  return (
    <div className={style.mainContainer}>
      <h1 className={style.heading}>Pilih Tipe Order</h1>
      <div className={style.options}>
        <Link to="/order-summary" className={style.optionCard}>
          <img
            src="/icons/order-kitchen.svg" alt="Kitchen Order"
            className={style.icon}
          />
          Dapur
        </Link>
        <Link to="/order-summary-food" className={style.optionCard}>
          <img src="/icons/food.svg" alt="Kitchen Order" className={style.icon} />
          Dapur Makan
        </Link>

        <Link to="/order-summary-drink" className={style.optionCard}>
          <img src="/icons/minuman.svg" alt="Kitchen Order" className={style.icon} />
          Dapur Minum
        </Link>

      </div>
    </div>
  );
};

export default TwoOptionLayout;
