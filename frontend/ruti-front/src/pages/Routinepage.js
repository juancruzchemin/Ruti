// src/pages/RoutineDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateButton from '../components/CreateButton';

function RoutineDetail() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener la rutina por su ID
    fetch(`http://localhost:3000/routines/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRoutine(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!routine) return <div>Cargando...</div>;

  return (
    <div>
      <CreateButton />
      <h1>{routine.name}</h1>
      <h1>{routine.startDate}</h1>
      <h1>{routine.endDate}</h1>
      {/* Mostrar otros detalles como ejercicios, etc. */}
    </div>
  );
}

export default RoutineDetail;
