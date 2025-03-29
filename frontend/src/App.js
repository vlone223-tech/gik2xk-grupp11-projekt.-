import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import ProductForm from './components/ProductForm';
import Login from './components/Login';

function App() {
  // Retrieve the logged-in user from localStorage.
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Handle user logout.
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Webshop</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  <FaShoppingBag />
                </Link>
              </li>
              {/* Only admin users can create new products */}
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/products/new">New Product</Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto align-items-center">
              {user ? (
                <>
                  <li className="nav-item me-3">
                    <span className="navbar-text text-white">
                      {user.role === 'admin' ? 'Admin' : 'User'}: {user.name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="btn nav-link text-white" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content container */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          {/* Admin-only routes */}
          <Route 
            path="/products/new" 
            element={user && user.role === 'admin' ? <ProductForm /> : <Navigate to="/" />} 
          />
          <Route 
            path="/products/:id/edit" 
            element={user && user.role === 'admin' ? <ProductForm /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
