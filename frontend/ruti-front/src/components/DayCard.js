import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';

const DayCard = () => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        // Función para obtener los ejercicios
        const fetchDays = async () => {
            try {
                const response = await axios.get('http://localhost:3000/days');
                setDays(response.data); // Guardamos los datos en el estado
            } catch (error) {
                console.error("Error fetching routines:", error);
            }
        };

        fetchDays(); // Llamada a la función
    }, []);

    return (
        <div className="container my-4">
            <h2>Days</h2>
            <Carousel data-bs-theme="dark" interval={null}>
                {days.map((day) => (
                    <Carousel.Item key={day._id}>
                        <div className="card text-center">
                            <div key={day._id} className="card-body">
                                <h5 className="card-title">{day.name}</h5>
                                <a href={`/${day._id}`} className="btn btn-primary">
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );

};

export default DayCard;
