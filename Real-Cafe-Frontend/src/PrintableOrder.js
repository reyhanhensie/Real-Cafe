// PrintableOrder.js
import React from 'react';
import "./PrintableOrder.css"; // Import custom styling


const PrintableOrder = React.forwardRef((props, ref) => {
  const { mejaNo, orderItems, totalPrice, message } = props;
  
  return (
    <div className='Receipt' ref={ref} style={{ textAlign: 'center', margin: '20px' }}>
      <h2>REAL CAFE</h2>
      <h3>Pesanan Anda</h3>
      <p>Nomor Meja: {mejaNo}</p>
      <ul>
        {orderItems.map((item, index) => (
          <li key={index}>
            {item.qty}x {item.name} - Rp. {item.price * item.qty}
          </li>
        ))}
      </ul>
      <h3>Total Harga: Rp. {totalPrice}</h3>
      {message && <p>Catatan: {message}</p>}
    </div>
  );
});

export default PrintableOrder;
