import React, { useEffect, useState } from 'react';
import API_URL from "./apiconfig";
import './MenuFotoEdit.css';


const MenuFotoEdit = () => {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: '', image: null });
  const [editingMenu, setEditingMenu] = useState(null);


  useEffect(() => {
    fetch(`${API_URL}/daftar-menu`)
      .then(res => res.json())
      .then(data => setMenus(data));
  }, []);

  const handleInputChange = (e) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewMenu({ ...newMenu, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newMenu.name);
    formData.append('image', newMenu.image);

    const res = await fetch(`${API_URL}/menufoto`, {
      method: 'POST',
      body: formData,
    });

    const newItem = await res.json();
    setMenus([...menus, newItem]);
    setNewMenu({ name: '', image: null });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/menufoto/${id}`, {
      method: 'DELETE',
    });
    setMenus(menus.filter((menu) => menu.id !== id));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', editingMenu.name);
    if (editingMenu.image instanceof File) {
      formData.append('image', editingMenu.image);
    }
    formData.append('_method', 'PUT');


    const res = await fetch(`${API_URL}/menufoto/${editingMenu.id}`, {
      method: 'POST', // <- Some Laravel servers accept PUT via POST with `_method`
      body: formData,
    });

    const updated = await res.json();
    setMenus(menus.map((m) => (m.id === updated.id ? updated : m)));
    setEditingMenu(null);
  };

  return (
    <div className="menu-foto-edit">
      <h2>📷 Menu Foto Editor (Superadmin Only)</h2>

      <form onSubmit={editingMenu ? handleUpdate : handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Nama Menu"
          value={editingMenu ? editingMenu.name : newMenu.name}
          onChange={(e) =>
            editingMenu
              ? setEditingMenu({ ...editingMenu, name: e.target.value })
              : setNewMenu({ ...newMenu, name: e.target.value })
          }
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) =>
            editingMenu
              ? setEditingMenu({ ...editingMenu, image: e.target.files[0] })
              : setNewMenu({ ...newMenu, image: e.target.files[0] })
          }
        />
        <button type="submit">{editingMenu ? 'Update Menu' : 'Tambah Menu'}</button>
        {editingMenu && <button onClick={() => setEditingMenu(null)}>Batal</button>}
      </form>

      <hr />

      <div className="menu-grid">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-card">
            <img src={menu.image} alt={menu.name} />
            <p>{menu.name}</p>
            <button onClick={() => handleDelete(menu.id)}>Hapus</button>
            <button onClick={() => setEditingMenu(menu)}>Edit</button>
          </div>
        ))}
      </div>
    </div>

  );
};

export default MenuFotoEdit;
