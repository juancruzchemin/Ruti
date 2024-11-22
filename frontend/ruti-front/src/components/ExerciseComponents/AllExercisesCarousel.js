// src/components/ExerciseCarousel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ExerciseStyles/ExercisePage.css';

const ExerciseCarousel = ({ onExerciseClick, onAddExerciseClick }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Función para obtener los ejercicios
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:3000/exercises');
        setExercises(response.data); // Guardamos los datos en el estado
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises(); // Llamada a la función
  }, []);

  // Función para agrupar ejercicios en lotes de 3 (puedes cambiar el número si prefieres más o menos ejercicios por slide)
  const reduceExercises = (acc, curr, idx) => {
    const chunkIndex = Math.floor(idx / 3);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // crea un nuevo array para cada chunk
    }
    acc[chunkIndex].push(curr);
    return acc;
  };

  const exerciseChunks = exercises.reduce(reduceExercises, []);

  // Añadir un elemento adicional para el botón "Agregar Ejercicio"
  if (exerciseChunks.length > 0) {
    exerciseChunks[exerciseChunks.length - 1].push({ isAddButton: true });
  } else {
    exerciseChunks.push([{ isAddButton: true }]);
  }

  return (
    <div className="my-4">
      <h2>All Exercises</h2>
      <Carousel interval={null} indicators={false}>
        {exerciseChunks.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              {chunk.map((exercise, idx) => (
                exercise.isAddButton ? (
                  <Button key={idx} onClick={onAddExerciseClick} className="mx-2" style={{ width: '18rem' }}>
                    Agregar Ejercicio
                  </Button>
                ) : (
                  <div
                    key={exercise._id}
                    className="card mx-2"
                    style={{ width: '18rem', cursor: 'pointer' }}
                    onClick={() => onExerciseClick(exercise)}
                  >
                    <div className="content-container">
                      <h1 className='title'>{exercise.name}</h1>
                    </div>
                  </div>
                )
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ExerciseCarousel;
