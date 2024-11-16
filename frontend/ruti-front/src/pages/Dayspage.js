// src/pages/dayDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateButton from '../components/CreateButton';

function DayDetails() {
  const { id } = useParams();
  const [day, setDay] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener la rutina por su ID
    fetch(`http://localhost:3000/days/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDay(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!day) return <div>Cargando...</div>;

  return (
    <div>
      <CreateButton />
      <h1>{day.name}</h1>
      {/* Mostrar otros detalles como ejercicios, etc. */}
    </div>
  );
}

export default DayDetails;
