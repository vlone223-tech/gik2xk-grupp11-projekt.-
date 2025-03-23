import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Rating } from '@mui/material';
import { Button, Form } from 'react-bootstrap';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch product on mount
  useEffect(() => {
    axios.get(`http://localhost:3305/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  // Calculate average rating
  const averageRating = product?.ratings?.length
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
    : 0;

  // Handle submitting a rating
  const handleRatingSubmit = () => {
    axios.post(`http://localhost:3305/products/${id}/addRating`, { rating: newRating, comment })
      .then(() => {
        alert('Rating submitted!');
        // Re-fetch the product to show the new rating
        return axios.get(`http://localhost:3305/products/${id}`);
      })
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error submitting rating:', error));
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    // Check if a user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to add items to your cart!');
      return;
    }
    // POST request to add product to the user's cart
    axios.post('http://localhost:3305/cart/addProduct', {
      userId: user.id,
      productId: id,
      quantity: 1
    })
      .then(() => alert('Product added to cart!'))
      .catch(error => console.error('Error adding to cart:', error));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="card mb-4">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.name}
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body">
        <h1 className="card-title">{product.name}</h1>
        <p className="card-text">{product.description}</p>
        <p className="card-text">
          <strong>Price:</strong> ${product.price}
        </p>

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

        <div className="mb-3">
          <h4>Rate this product:</h4>
          <Rating
            value={newRating}
            onChange={(e, newValue) => setNewRating(newValue)}
          />
          <Form.Group controlId="comment" className="mt-2">
            <Form.Label>Comment (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" className="mt-2" onClick={handleRatingSubmit}>
            Submit Rating
          </Button>
        </div>

        <Button variant="success" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductDetail;
