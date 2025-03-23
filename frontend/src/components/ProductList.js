// frontend/src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);
  
  // Check if user is logged in and parse their info
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    axios.get('http://localhost:3305/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1 className="mb-4">Products</h1>

      {/* If user is admin, show a Bootstrap alert confirming admin login */}
      {user && user.role === 'admin' && (
        <div className="alert alert-success">
          You are logged in as Admin: <strong>{user.name}</strong>
        </div>
      )}

      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                <Rating value={3} readOnly size="small" />
              </div>
              {/* Only show Edit if user is admin */}
              {user && user.role === 'admin' && (
                <div className="card-footer">
                  <Link to={`/products/${product.id}/edit`} className="btn btn-primary btn-sm">
                    Edit
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
