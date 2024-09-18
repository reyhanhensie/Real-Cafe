import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./OrderForm.css"; // Import custom styling
import API_URL from "./apiconfig"; // Import the API_URL
import ReactToPrint from "react-to-print";
import PrintableOrder from "./PrintableOrder"; // Import the printable component

const OrderForm = () => {
  const printRef = useRef(null); // Reference to the print section

  const categoryMap = {
    Camilan: "Camilan",
    Coffe: "Coffe",
    Jus: "Jus",
    Lalapan: "Lalapan",
    Makanan: "Makanan",
    Milkshake: "Milkshake",
    "Minuman Dingin": "Minuman Dingin",
    "Minuman Panas": "Minuman Panas",
  };

  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState("Makanan");
  const [menuData, setMenuData] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [mejaNo, setMejaNo] = useState("");
  const [message, setMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

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
  const [selectedValue, setSelectedValue] = useState("");
  // const nama_kasir = axios.get(`${API_URL}`);
  const options = [{ value: "Option 1", label: "Option 1" }];

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

  const handleMejaNoChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    const numberValue = value
      ? Math.min(99, Math.max(1, parseInt(value, 10)))
      : "";
    setMejaNo(numberValue.toString());
  };

  // const saveAsPDF = () => {
  //   const element = printRef.current;
  //   if (!element) return;

  //   // Temporarily show the element
  //   const originalDisplay = element.style.display;
  //   element.style.display = "block";

  //   const opt = {
  //     margin: 1,
  //     filename: `Order_${new Date().toISOString()}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //   };

  //   html2pdf()
  //     .from(element)
  //     .set(opt)
  //     .save()
  //     .then(() => {
  //       element.style.display = originalDisplay;
  //     });
  // };
  const downloadPDF = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/receipt/${orderId}`, {
        responseType: "blob", // Set the response type to blob to handle binary data
      });
      // Generate a timestamp
      const timestamp = new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta", hour12: false })
        .split(".")[0]
        .replace(/:/g, "_");

      // Create a link element
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      // link.setAttribute('download', `order_${orderId}.pdf`);
      link.setAttribute("download", `Order_${timestamp}_ID-${orderId}.pdf`);

      // Append the link to the body
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF", err);
    }
  };

  const handleSubmit = async () => {
    const mejaNoNumber = parseInt(mejaNo, 10);
    if (isNaN(mejaNoNumber)) {
      setError("Masukkan Nomor Meja Terlebih Dahulu!");
      return;
    }

    try {
      const formattedItems = orderItems.map((item) => ({
        type: item.type,
        id: item.id,
        qty: item.qty,
      }));

      if (formattedItems.length === 0) {
        setError("ERROR: Minimal 1 Pesanan");
        return;
      }

      const response = await axios.post(`${API_URL}/send-order`, {
        meja: mejaNoNumber,
        message: message,
        items: formattedItems,
      });

      alert(`Pesanan Berhasil Dibuat!, ID Pesanan : ${response.data.id}`);

      setOrderItems([]);
      setTotalPrice(0);
      setMejaNo("");
      setMessage("");
      setAddedItems({});
      downloadPDF(response.data.id);
    } catch (err) {
      setError("Error, Stock Habis");
    }
  };

  const isMinimalOrder = orderItems.length !== 0;
  const isMejaNoValid = mejaNo.trim() !== "";
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
                <span className="item-stock">{item.qty || "Habis"}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">Rp. {item.price}</span>
                {!addedItems[
                  selectedCategory.toLowerCase().replace(/\s+/g, "")
                ]?.has(item.id) ? (
                  <button
                    className="item-add"
                    onClick={() =>
                      handleAddItem(item.id, item.name, item.price)
                    }
                  >
                    <img
                      src="/icons/plus-solid2.svg"
                      alt="Add Icon"
                      className="add-icon"
                    />
                  </button>
                ) : (
                  <span className="item-add-placeholder"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-summary">
        <span className="header">
          <h3>Your Order</h3>
          <h3 id="kasir">Kasir :</h3>
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </span>

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
                - Rp. {item.price * item.qty}{" "}
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
              type="text"
              value={mejaNo}
              onChange={handleMejaNoChange}
              placeholder="Nomor"
            />
            {isMejaNoValid ? <h2></h2> : <h4>masukkan nomor meja !</h4>}
          </div>

          <h3>Total Price: Rp. {totalPrice}</h3>
          {/* <button onClick={handleSubmit}>Kirim Ke Dapur</button> */}
          {/* Conditional rendering of ReactToPrint based on mejaNo */}
          {isMejaNoValid && isMinimalOrder ? (
            <ReactToPrint
              trigger={() => <button>Kirim Ke Dapur</button>}
              content={() => printRef.current}
              // onBeforePrint={saveAsPDF}
              onAfterPrint={handleSubmit}
            />
          ) : (
            <button disabled>Kirim Ke Dapur</button>
          )}
          {/* <button onClick={saveAsPDF}>Save as PDF</button> */}
          {error && <p>{error}</p>}
        </div>
      </div>

      {/* The printable component */}
      <PrintableOrder
        ref={printRef}
        mejaNo={mejaNo}
        orderItems={orderItems}
        totalPrice={totalPrice}
        message={message}
      />
    </div>
  );
};

export default OrderForm;
