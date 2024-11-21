import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/RoutineCard.css';
import { format } from 'date-fns';

const Section = () => {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await axios.get('http://localhost:3000/routines');
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

    return (
        <div className="container my-4">
            <h2>Routines</h2>
            <Carousel interval={null} indicators={false}>
                {routineChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((routine) => {
                                const formattedStartDate = format(new Date(routine.startDate), 'dd/MM/yyyy');
                                const formattedEndDate = format(new Date(routine.endDate), 'dd/MM/yyyy');
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
            </Carousel>
        </div>
    );
};

export default Section;
