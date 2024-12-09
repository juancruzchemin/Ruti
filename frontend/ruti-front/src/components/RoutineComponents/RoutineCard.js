import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import '../styles/RoutineStyles/RoutineCard.css';
import { format } from 'date-fns';

const Section = () => {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/routines', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRoutines(response.data);
            } catch (error) {
                console.error("Error fetching routines:", error);
            }
        };

        fetchRoutines();
    }, []);

    // Función para agrupar rutinas en lotes de 3
    const reduceRoutines = (acc, curr, idx) => {
        const chunkIndex = Math.floor(idx / 3);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = []; // crea un nuevo array para cada chunk
        }
        acc[chunkIndex].push(curr);
        return acc;
    };

    const routineChunks = routines.reduce(reduceRoutines, []);

    // Función para crear una nueva rutina
    const handleAddRoutine = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/routine', {
                name: 'New Routine',
                startDate: new Date(),
                endDate: new Date()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRoutines([...routines, response.data.routine]);
        } catch (error) {
            console.error("Error creating routine:", error);
        }
    };

    return (
        <div className="container my-4">
            <h2>Routines</h2>
            <a href="/all-routines" className="view-all-link">View all</a>           
            <Carousel interval={null} indicators={false}>
                {routineChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((routine) => {
                                const formattedStartDate = routine.startDate ? format(new Date(routine.startDate), 'dd/MM/yyyy') : 'Fecha no válida';
                                const formattedEndDate = routine.endDate ? format(new Date(routine.endDate), 'dd/MM/yyyy') : 'Fecha no válida';
                                return (
                                    <div key={routine._id} className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }}>
                                        <Link to={`/routines/${routine._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="content-container">
                                                <h1 className='title'>{routine.name}</h1>
                                                <div className="date-container">
                                                    <div className="date-column">
                                                        <p className="label">Start Date:</p>
                                                        <p className="date">{formattedStartDate}</p>
                                                    </div>
                                                    <div className="date-column">
                                                        <p className="label">End Date:</p>
                                                        <p className="date">{formattedEndDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </Carousel.Item>
                ))}
                {/* Agregar la carta para crear una nueva rutina como último ítem del carrusel */}
                <Carousel.Item>
                    <div className="d-flex justify-content-center">
                        <div className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }} onClick={handleAddRoutine}>
                            <div className="content-container">
                                <h1 className='title'>Agregar Rutina</h1>
                                <div className="date-container">
                                    <div className="date-column">
                                        <p className="label">Click para agregar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    );
};

export default Section;
