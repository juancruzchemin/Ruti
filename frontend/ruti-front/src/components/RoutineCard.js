import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    // Divide las rutinas en grupos para cada slide (3 elementos por slide en este ejemplo)
    const chunkSize = 3;
    const routineChunks = [];
    for (let i = 0; i < routines.length; i += chunkSize) {
        routineChunks.push(routines.slice(i, i + chunkSize));
    }

    return (
        <div className="container my-4">
            <h2>Routines</h2>
            <Carousel data-bs-theme="dark" interval={null}>
                {routineChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            {chunk.map((routine) => (
                                <div key={routine._id} className="card mx-2" style={{ width: '18rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{routine.name}</h5>
                                        <p className="card-text">Start Date: {routine.startDate}</p>
                                        <p className="card-text">End Date: {routine.endDate}</p>
                                        <a href={`/routines/${routine._id}`} className="btn btn-primary">
                                            Ver detalles
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Section;
