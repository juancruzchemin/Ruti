// src/components/Card.js
import React from 'react';
import { Link } from 'react-router-dom';

function Card({ routine }) {
  return (
    <div className="card">
      <h2>{routine.name}</h2>
      <p>{routine.description}</p>
      <Link to={`/routine/${routine.id}`}>Ver detalles</Link>
    </div>
  );
}

export default Card;
