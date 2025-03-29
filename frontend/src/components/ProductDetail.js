import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Rating } from '@mui/material';
import { Button } from 'react-bootstrap';
import RatingForm from './RatingForm';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  // Retrieve user information from localStorage.
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  const fetchProduct = () => {
    axios.get(`http://localhost:3305/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  };
  
  // Calculate the average rating.
  const averageRating = product?.ratings?.length
    ? product.ratings.reduce((total, r) => total + r.rating, 0) / product.ratings.length
    : 0;
  
  // Handle adding the product to the cart.
  const handleAddToCart = () => {
    if (!user) {
      alert('Please log in to add items to your cart!');
      return;
    }
    axios.post('http://localhost:3305/cart/addProduct', {
      userId: user.id,
      productId: id,
      quantity: 1
    })
      .then(() => alert('Product added to cart!'))
      .catch(error => console.error('Error adding to cart:', error));
  };
  
  // Admin-only: Navigate to the edit page.
  const handleEditProduct = () => {
    navigate(`/products/${id}/edit`);
  };

  // Admin-only: Handle product deletion.
  const handleDeleteProduct = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:3305/products/${id}`)
        .then(() => {
          alert('Product deleted successfully.');
          window.location.href = "/";
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Error deleting product.');
        });
    }
  };
  
  if (!product) return <div>Loading...</div>;
  
  return (
    <div className="card mb-4">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img-top img-fluid"
          style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
        />
      )}
      <div className="card-body">
        <h1 className="card-title">{product.name}</h1>
        <p className="card-text">{product.description}</p>
        <p className="card-text"><strong>Price:</strong> ${product.price}</p>
  
        <h3>Average Rating: {averageRating.toFixed(1)}</h3>
        <Rating value={averageRating} precision={0.1} readOnly />
  
        <hr />
  
        <h4>Ratings:</h4>
        {product.ratings && product.ratings.length > 0 ? (
          product.ratings.map(r => (
            <div key={r.id} className="mb-2">
              <Rating value={r.rating} readOnly size="small" />
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))
        ) : (
          <p>No ratings yet.</p>
        )}
  
        <hr />
  
        {user && user.role === 'admin' ? (
          // For admin users, display both the edit and delete buttons.
          <div className="mt-3">
            <Button
              variant="warning"
              onClick={handleEditProduct}
              style={{ marginRight: '10px' }}
            >
              Edit Product
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </div>
        ) : (
          // For non-admin users, allow rating submission and adding to cart.
          <>
            <RatingForm onSubmit={({ rating, comment }) => {
              axios.post(`http://localhost:3305/products/${id}/addRating`, { rating, comment })
                .then(() => {
                  alert('Rating submitted!');
                  fetchProduct();
                })
                .catch(error => console.error('Error submitting rating:', error));
            }} />
            <Button variant="success" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
