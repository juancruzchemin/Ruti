import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/DayStyles/DayCarousel.css'; // Importar el archivo CSS si es necesario

function DayCarousel({ routineId, onDayAdded, onAddDay }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener todos los días
    fetchDays();
  }, []);

  const fetchDays = async () => {
    const response = await fetch('http://localhost:3000/days');
    const data = await response.json();
    setDays(data);
  };

  const handleAddDayToRoutine = async (dayId) => {
    // Llamada a la API para añadir el día a la rutina
    await fetch('http://localhost:3000/routines/add-day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ routineId, dayId }),
    });

    // Llamar a la función de callback para actualizar el estado de la rutina en el componente padre
    onDayAdded();
  };

  // Función para agrupar días en lotes de 5
  const chunkDays = (days, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < days.length; i += chunkSize) {
      chunks.push(days.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const dayChunks = chunkDays(days, 5);

  return (
    <div>
      <Carousel interval={null} indicators={false} data-bs-theme="dark">
        {dayChunks.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              {chunk.map((day) => (
                <div key={day._id} className="card mx-2" style={{ width: '18rem', cursor: 'pointer' }} onClick={() => handleAddDayToRoutine(day._id)}>
                  <div className="card-body">
                    <h5 className="card-title">{day.name}</h5>
                  </div>
                </div>
              ))}
              {/* Añadir el botón "Agregar nuevo día" al final del último chunk */}
              {index === dayChunks.length - 1 && (
                <div className="card mx-2" style={{ width: '18rem', cursor: 'pointer', backgroundColor: 'blue' }}>
                  <div className="card-body d-flex align-items-center justify-content-center" onClick={onAddDay}>
                    Agregar nuevo día
                  </div>
                </div>
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default DayCarousel;
