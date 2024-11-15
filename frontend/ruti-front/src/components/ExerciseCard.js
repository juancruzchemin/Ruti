import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const ExerciseCard = () => {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        // Función para obtener los ejercicios
        const fetchExercises = async () => {
            try {
                const response = await axios.get('http://localhost:3000/exercises');
                setExercises(response.data); // Guardamos los datos en el estado
            } catch (error) {
                console.error("Error fetching routines:", error);
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
            <h3>Exercise List</h3>
            <Carousel data-bs-theme="dark" interval={null}>
                {exerciseChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((exercise, idx) => (
                                <Card key={idx} style={{ width: "18rem" }} className="mx-2">
                                    <Card.Body>
                                        <Card.Title>{exercise.name}</Card.Title>
                                        <Button variant="primary" href={`/${exercise._id}`}>
                                            Ver detalles
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );

};

export default ExerciseCard;
