import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/DayCard.css';
import { Button } from 'react-bootstrap';

const DayCard = ({ onAddDayClick }) => {
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

    // Añadir el botón "Agregar Día" al final del último chunk
    if (exerciseChunks.length > 0) {
        exerciseChunks[exerciseChunks.length - 1].push({ isAddButton: true });
    } else {
        exerciseChunks.push([{ isAddButton: true }]);
    }

    return (
        <div className="my-4">
            <h2>All days</h2>
            <Carousel interval={null} indicators={false}>
                {exerciseChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((day, idx) => (
                                day.isAddButton ? (
                                    <Button key={idx} onClick={onAddDayClick} className="mx-2" style={{ width: '18rem' }}>
                                        Agregar Día
                                    </Button>
                                ) : (
                                    <div key={day._id} className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }}>
                                        <Link to={`/days/${day._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="content-container">
                                                <h1 className='title'>{day.name}</h1>
                                            </div>                                              
                                        </Link>
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

export default DayCard;
