// src/pages/exerciseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateButton from '../components/CreateButton';

function ExerciseDetails() {
  const { id } = useParams();
  const [exercise, setExercises] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener la rutina por su ID
    fetch(`http://localhost:3000/exercises/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setExercises(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!exercise) return <div>Cargando...</div>;

  return (
    <div>
      <CreateButton />
      <h1>{exercise.name}</h1>
      <h1>{exercise.repetition}</h1>
      <h1>{exercise.serie}</h1>
      <h1>{exercise.weight}</h1>
      {/* Mostrar otros detalles como ejercicios, etc. */}
    </div>
  );
}

export default ExerciseDetails;
