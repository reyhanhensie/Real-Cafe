// src/Order.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/food-menu')
            .then(response => {
                setData(response.data.message);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <h1>{data ? data : 'Loading...'}</h1>
        </div>
    );
};

export default Order;