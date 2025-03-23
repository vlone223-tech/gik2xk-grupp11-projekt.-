import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';


function Cart() {
  const [cart, setCart] = useState(null);
  const userId = 1; // Example static userId

  useEffect(() => {
    axios.get(`http://localhost:3305/cart/${userId}`)
      .then(response => setCart(response.data))
      .catch(error => console.error('Error fetching cart:', error));
  }, [userId]);

  if (!cart) return (
    <div className="container">
      <h2>Your cart is empty.</h2>
    </div>
  );

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cart.Products && cart.Products.map(item => (
        <div key={item.id} className="card mb-2">
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p className="card-text">Price: ${item.price}</p>
            <p className="card-text">Quantity: {item.CartItem.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
