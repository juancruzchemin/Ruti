import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/DayCard.css'

const DayCard = () => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        // Función para obtener los días
        const fetchDays = async () => {
            try {
                const response = await axios.get('http://localhost:3000/days');
                setDays(response.data); // Guardamos los datos en el estado
            } catch (error) {
                console.error("Error fetching days:", error);
            }
        };

        fetchDays(); // Llamada a la función
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

    const exerciseChunks = days.reduce(reduceExercises, []);

    return (
        <div className="container my-4">
            <h2>Days</h2>
            <Carousel data-bs-theme="dark" interval={null} indicators={false}>
                {exerciseChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((day, idx) => (
                                <div key={day._id} className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }}>
                                    <Link to={`/days/${day._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card-body">
                                            <div className='card-title'>
                                                <h5 className="title">
                                                    {day.name}
                                                </h5>
                                            </div>
                                            <div className="date-column">
                                                <p className="label">Exercises:</p>
                                                {day.exercises && day.exercises.length > 0 ? (
                                                    day.exercises.map((exercise, exerciseIdx) => (
                                                        <p key={exerciseIdx} className="date">{exercise.name}</p>
                                                    ))
                                                ) : (
                                                    <p className="date">No exercises</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div >
    );
};

export default DayCard;
