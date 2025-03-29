import React, { useState } from 'react';
import { Rating } from '@mui/material';
import { Button, Form } from 'react-bootstrap';

const RatingForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="mb-3">
      <h4>Rate this product:</h4>
      <Rating
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
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
      <Button variant="primary" className="mt-2" onClick={handleSubmit}>
        Submit Rating
      </Button>
    </div>
  );
};

export default RatingForm;
