import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ExerciseCard.css'

const ExerciseCard = () => {
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


    return (
        <div className="container my-4">
            <h2>Exercises</h2>
            <Carousel data-bs-theme="dark" interval={null} indicators={false}>
                {exerciseChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((exercise, idx) => (
                                <div key={exercise._id} className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }}>
                                    <Link to={`/exercises/${exercise._id}`} key={exercise._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card-body">
                                            <div className='card-title'>
                                                <h5 className="title">
                                                    {exercise.name}
                                                </h5>
                                            </div>
                                            <div className="card-text">
                                                <div className="date-column">
                                                    <p className="label">Repetition:</p>
                                                    <p className="date">{exercise.repetition}</p>
                                                </div>
                                                <div className="date-column">
                                                    <p className="label">Serie:</p>
                                                    <p className="date">{exercise.serie}</p>
                                                </div>
                                                <div className="date-column">
                                                    <p className="label">Weight:</p>
                                                    <p className="date">{exercise.weight}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default ExerciseCard;
