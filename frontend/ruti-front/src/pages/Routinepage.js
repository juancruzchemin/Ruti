import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Modal from 'react-modal';
import '../components/styles/Routinepage.css';

Modal.setAppElement('#root'); // Asegúrate de que esto esté configurado correctamente

function RoutineDetail() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener la rutina por su ID
    fetch(`http://localhost:3000/routines/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRoutine(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  const openModal = (dayId) => {
    setSelectedDayId(dayId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDayId(null);
  };

  const handleAddExercise = () => {
    // Lógica para agregar un ejercicio
    console.log(`Agregar ejercicio al día con ID: ${selectedDayId}`);
    closeModal();
  };

  const handleEditDayName = () => {
    const newName = prompt('Ingrese el nuevo nombre del día:');
    if (newName) {
      // Lógica para editar el nombre del día
      console.log(`Editar nombre del día con ID: ${selectedDayId} a ${newName}`);
    }
    closeModal();
  };

  const handleDeleteDay = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este día?')) {
      // Lógica para eliminar el día
      console.log(`Eliminar día con ID: ${selectedDayId}`);
    }
    closeModal();
  };

  if (!routine) return <div>Cargando...</div>;

  const formattedStartDate = format(new Date(routine.startDate), 'dd/MM/yyyy');
  const formattedEndDate = format(new Date(routine.endDate), 'dd/MM/yyyy');

  return (
    <div className="container">
      <div className="header">
        <h1>{routine.name}</h1>
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
      <div>
        {routine.days && routine.days.length > 0 ? (
          routine.days.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-title">
                {day.name}
                <button className='btn primary' onClick={() => openModal(day._id)}>⋮</button>
              </div>
              <ul className="exercise-list">
                {day.exercises && day.exercises.length > 0 ? (
                  day.exercises.map((exercise, exerciseIndex) => (
                    <li key={exerciseIndex} className="exercise-item">
                      <p>{exercise.name}</p>
                      <p>{exercise.repetition} x {exercise.serie}</p>
                      <p>{exercise.weight} Kg</p>
                    </li>
                  ))
                ) : (
                  <li className="exercise-item">No exercises</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No days available</p>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Opciones del Día"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Opciones del Día</h2>
        <button onClick={handleEditDayName}>Editar Nombre</button>
        <button onClick={handleDeleteDay}>Eliminar Día</button>
        <button onClick={handleAddExercise}>Agregar Ejercicio</button>
        <button onClick={closeModal}>Cerrar</button>
      </Modal>
    </div>
  );
}

export default RoutineDetail;
