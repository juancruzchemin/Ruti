import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/ExerciseStyles/ExerciseCarousel.css'; // Importar el archivo CSS

function ExerciseCarousel({ dayId, onExerciseAdded }) {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener todos los días
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const response = await fetch('http://localhost:3000/exercises');
    const data = await response.json();
    setExercises(data);
  };

  const handleAddexerciseToDay = async (exerciseId) => {
    // Llamada a la API para añadir el día a la rutina
    await fetch('http://localhost:3000/days/add-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dayId, exerciseId }),
    });

    // Llamar a la función de callback para actualizar el estado de la rutina en el componente padre
    onExerciseAdded();
  };

  // Función para agrupar días en lotes de 5
  const chunkExercises = (exercises, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < exercises.length; i += chunkSize) {
      chunks.push(exercises.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const exerciseChunks = chunkExercises(exercises, 1);

  return (
    <Carousel interval={null} indicators={false} data-bs-theme="dark">
      {exerciseChunks.map((chunk, index) => (
        <Carousel.Item key={index}>
          <div className="d-flex justify-content-center">
            {chunk.map((exercise) => (
              <div key={exercise._id} className="card mx-2 exercise-card" onClick={() => handleAddexerciseToDay(exercise._id)}>
                <div className="card-body">
                  <h5 className="card-title">{exercise.name}</h5>
                  <p className="card-text">{exercise.repetition} reps - {exercise.serie} series - {exercise.weight}Kg</p>
                </div>
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ExerciseCarousel;
