// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="app">
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer className="footer" />
  </div>
);

export default Layout;