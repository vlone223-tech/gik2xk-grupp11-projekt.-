import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function ProductForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3305/products/${id}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.put(`http://localhost:3305/products/${id}`, formData)
        .then(() => {
          alert('Product updated!');
          navigate('/');
        })
        .catch(error => console.error('Error updating product:', error));
    } else {
      axios.post(`http://localhost:3305/products`, formData)
        .then(() => {
          alert('Product created!');
          navigate('/');
        })
        .catch(error => console.error('Error creating product:', error));
    }
  };

  return (
    <div className="card p-4">
      <h1>{id ? 'Edit Product' : 'New Product'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            as="textarea"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="stock" className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="imageUrl" className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {id ? 'Update Product' : 'Create Product'}
        </Button>
      </Form>
    </div>
  );
}

export default ProductForm;
