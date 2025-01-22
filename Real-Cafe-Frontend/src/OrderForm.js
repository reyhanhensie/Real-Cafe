import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./OrderForm.css"; // Import custom styling
import API_URL from "./apiconfig"; // Import the API_URL
import ReactToPrint from "react-to-print";
import PrintableOrder from "./PrintableOrder"; // Import the printable component

const OrderForm = () => {
  // const printRef = useRef(null); // Reference to the print section

  const categoryMap = {
    Camilan: "Camilan",
    Coffe: "Coffe",
    Jus: "Jus",
    Lalapan: "Lalapan",
    Makanan: "Makanan",
    Milkshake: "Milkshake",
    "Minuman Dingin": "Minuman Dingin",
    "Minuman Panas": "Minuman Panas",
    Paket: "Paket",
  };

  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState("Makanan");
  const [menuData, setMenuData] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [mejaNo, setMejaNo] = useState("");
  const [Bayar, setBayar] = useState("");
  const [message, setMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [Kembalian, setKembalian] = useState(0);
  const [error, setError] = useState(null);
  const [SelectedCashier, setSelectedCashier] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/Menu`);
        setMenuData(response.data);
        console.log(API_URL);
      } catch (err) {
        setError("Error fetching menu items");
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    setAddedItems(
      orderItems.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = new Set();
        acc[item.type].add(item.id);
        return acc;
      }, {})
    );
  }, [orderItems]);

  const handleAddItem = (id, name, price) => {
    const type = selectedCategory.toLowerCase().replace(/\s+/g, "");

    setOrderItems((prevOrderItems) => {
      const newItems = [...prevOrderItems, { type, id, name, qty: 1, price }];
      calculateTotalPrice(newItems);
      return newItems;
    });

    setAddedItems((prevAddedItems) => ({
      ...prevAddedItems,
      [type]: new Set([...(prevAddedItems[type] || []), id]),
    }));
  };

  const cashierMap = {
    61112: "Risma",
    "03072": "Ryan",
    55671: "Ferdi",
    33205: "Nanda",
    13084: "Putri",
    69696: "Reyhan",
  };

  const [cashierCode, setCashierCode] = useState("");

  const handleCashierCodeChange = (event) => {
    const code = event.target.value.replace(/[^0-9]/g, "");
    setCashierCode(code);
    setSelectedCashier(cashierMap[code] || "");
  };
  const addItemHandler = (id, name, price) => () =>
    handleAddItem(id, name, price);

  const handleRemoveItem = (id, type) => {
    const newOrderItems = orderItems.filter(
      (item) => !(item.id === id && item.type === type)
    );
    setOrderItems(newOrderItems);
    calculateTotalPrice(newOrderItems);

    setAddedItems((prevAddedItems) => {
      const updatedCategoryItems = new Set(prevAddedItems[type] || []);
      updatedCategoryItems.delete(id);

      return {
        ...prevAddedItems,
        [type]: updatedCategoryItems,
      };
    });
  };

  const handleChangeQty = (index, qty) => {
    // Ensure the input is a valid number and within the range [1, 99]
    const sanitizedQty = qty.toString().replace(/[^0-9]/g, ""); // Allow only numeric characters

    // Convert to a number and clamp between 1 and 99
    const validQty = Math.max(1, Math.min(99, parseInt(sanitizedQty, 10) || 1));

    // Create a copy of the orderItems to avoid mutating state directly
    const newOrderItems = [...orderItems];

    // Update the quantity of the item at the given index
    newOrderItems[index].qty = validQty;

    // Update the order items state
    setOrderItems(newOrderItems);

    // Recalculate the total price
    calculateTotalPrice(newOrderItems);

    // Clear any error messages related to the quantity input
    setError(null);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    // Recalculate Kembalian whenever totalPrice or Bayar changes
    calculateKembalian();
  }, [totalPrice, Bayar]);

  const calculateKembalian = () => {
    const kembalian = Math.max(0, parseInt(Bayar || 0, 10) - totalPrice);
    setKembalian(kembalian);
  };

  const PriceFormat = (price) => {
    if (price == null) return ""; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleMejaNoChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    const numberValue = value
      ? Math.min(99, Math.max(1, parseInt(value, 10)))
      : "";
    setMejaNo(numberValue.toString());
  };

  const handleBayar = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    const numberValue = value
      ? Math.min(10000000, Math.max(1, parseInt(value, 10)))
      : "";
    setBayar(numberValue.toString());
  };

  const handleSubmit = async () => {
    const mejaNoNumber = parseInt(mejaNo, 10);

    if (!SelectedCashier) {
      setError("Masukkan Kode Kasir Terlebih Dahulu");
      return;
    }
    if (isNaN(mejaNoNumber)) {
      setError("Masukkan Nomor Meja Terlebih Dahulu!");
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Set loading to true to indicate the request is in progress

    try {
      const formattedItems = orderItems.map((item) => ({
        type: item.type,
        id: item.id,
        qty: item.qty,
      }));

      if (formattedItems.length === 0) {
        setError("ERROR: Minimal 1 Pesanan");
        setLoading(false); // Reset loading state on error
        return;
      }

      const response = await axios.post(`${API_URL}/send-order`, {
        meja: mejaNoNumber,
        kasir: SelectedCashier,
        message: message,
        items: formattedItems,
        bayar: parseInt(Bayar, 10),
      });

      alert(`Pesanan Berhasil Dibuat!, ID Pesanan : ${response.data.id}`);

      setOrderItems([]);
      setTotalPrice(0);
      setMejaNo("");
      setMessage("");
      setAddedItems({});
      setBayar("");
      setSelectedCashier("");
    } catch (err) {
      setError("Error, Stock Habis");
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  const isMinimalOrder = orderItems.length !== 0;
  const isMejaNoValid = mejaNo.trim() !== "";
  const isKasirValid = SelectedCashier !== "";
  const isBayarValid = Bayar.trim() >= totalPrice;

  const [loading, setLoading] = useState(false); // Add a loading state

  return (
    <div className="order-form">
      <div className="menu-container">
        <div className="nav-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-section">
          <h3>{selectedCategory} Menu</h3>
          <ul>
            <li className="menu-header">
              <span className="header-stock">STOCK</span>
              <span className="header-name">NAMA</span>
              <span className="header-price">HARGA</span>
              <span className="header-add">TAMBAH</span>
            </li>
            {menuData[selectedCategory]?.map((item) => (
              <li key={item.id} className="menu-item">
                <span
                  className={`item-stock ${
                    item.qty === 0 ? "out-of-stock" : ""
                  }`}
                >
                  {item.qty || "Habis"}
                </span>

                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  Rp. {PriceFormat(item.price)}
                </span>
                {!addedItems[
                  selectedCategory.toLowerCase().replace(/\s+/g, "")
                ]?.has(item.id) ? (
                  <button
                    className="item-add"
                    onClick={addItemHandler(item.id, item.name, item.price)}
                  >
                    <img
                      src="/icons/plus-solid2.svg"
                      alt="Add Icon"
                      className="add-icon"
                    />
                  </button>
                ) : (
                  <button className="item-add-placeholder">
                    <img
                      src="/icons/checkmark.svg"
                      alt="Mark"
                      className="add-icon-placeholder"
                    />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-summary">
        <div className="header">
          <div className="order-cashier">
            <h3 id="Your-Order">Your Order</h3>
            <h3 id="kasir">Kasir : </h3>
            <input
              className=""
              type="number"
              value={cashierCode}
              onChange={handleCashierCodeChange}
              placeholder="Kode Kasir"
            />
            {error && error.includes("kasir") && (
              <p className="error-message">Pilih nama kasir terlebih dahulu!</p>
            )}
          </div>
        </div>

        <ul>
          {orderItems.map((item, index) => (
            <li key={index} className="order-item">
              <span className="order-name">{item.name}</span>
              <span className="order-qty-container">
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(index, item.qty - 1)}
                >
                  <img src="/icons/minus-small.svg" alt="-" />
                </button>
                <input
                  className="order-qty-input"
                  type="number"
                  value={item.qty}
                  min="1"
                  onChange={(e) => handleChangeQty(index, e.target.value)}
                />
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(index, item.qty + 1)}
                >
                  <img src="/icons/plus-small.svg" alt="+" />
                </button>
              </span>

              <span className="order-price">
                - Rp. {PriceFormat(item.price * item.qty)}{" "}
              </span>
              <button
                className="order-remove"
                onClick={() => handleRemoveItem(item.id, item.type)}
              >
                <img src="/icons/x-circle.svg" alt="X" />
              </button>
            </li>
          ))}
        </ul>
        <div className="order-form-input">
          <div className="order-form-message">
            <h3>Catatan</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan Catatan Pesanan (OPSIONAL)"
              rows="3" // Set the textarea to have 3 rows
              className="message-input" // Apply the class here
            />
          </div>

          <div className="order-form-meja">
            <h3>Nomor Meja :</h3>
            <input
              type="number"
              value={mejaNo}
              onChange={handleMejaNoChange}
              placeholder="Nomor"
            />
            {isMejaNoValid ? <h2></h2> : <h4>Masukkan Nomor Meja !</h4>}
          </div>
          <div className="order-form-bayar">
            <h3>Bayar :</h3>
            <input
              type="number"
              value={Bayar}
              onChange={handleBayar}
              placeholder="Rp. "
            />
            {isBayarValid ? <h2></h2> : <h4>Uang Kurang !</h4>}
          </div>

          <h3>Total Price: Rp. {PriceFormat(totalPrice)}</h3>
          <h3>Kembalian: Rp. {PriceFormat(Kembalian)}</h3>
          {/* Conditional rendering of ReactToPrint based on mejaNo */}
          {isMejaNoValid && isMinimalOrder && isBayarValid && isKasirValid ? (
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Kirim Ke Dapur"}
            </button>
          ) : (
            <button disabled>Kirim Ke Dapur</button>
          )}
          {/* <button onClick={saveAsPDF}>Save as PDF</button> */}
          {error && <p>{error}</p>}
        </div>
      </div>

      {/* The printable component */}
      {/* <PrintableOrder
      ref={printRef}
      mejaNo={mejaNo}
      orderItems={orderItems}
      totalPrice={totalPrice}
      message={message}
    /> */}
    </div>
  );
};

export default OrderForm;
