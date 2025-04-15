import React, { useEffect, useState } from 'react';
import './MenuFoto.css'; // Add your CSS here
import API_URL from "./apiconfig";

const MenuList = () => {
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/daftar-menu`)
            .then(res => res.json())
            .then(data => setMenus(data));
    }, []);
    useEffect(() => {
        const container = document.querySelector('.menu-container');
        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        };

        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);


    return (
        <div className="menu-foto-container">
            {menus.map(menu => (
                <div key={menu.id} className="menu-item">
                    <img
                        src={menu.image}
                        alt={menu.name}
                        className="menu-image"
                    />
                    {/* <p>{menu.name}</p> */}
                </div>
            ))}
        </div>
    );
};

export default MenuList;
