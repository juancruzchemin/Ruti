import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoutineHeader from '../components/RoutineHeader';
import DayRoutineCard from '../components/DayRoutineCard';
import DayCarousel from '../components/DayCarousel';
import RoutineModal from '../components/RoutineModal';
import '../components/styles/Routinepage.css';

function RoutineDetail() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isCreatingDay, setIsCreatingDay] = useState(false);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDay, setNewDay] = useState({ name: '' });
  const [newExercise, setNewExercise] = useState({ name: '', repetition: '', serie: '', weight: '' });

  useEffect(() => {
    // Llamada a la API para obtener la rutina por su ID
    fetchRoutine();
  }, [id]);

  const fetchRoutine = async () => {
    const response = await fetch(`http://localhost:3000/routines/${id}`);
    const data = await response.json();
    setRoutine(data);
  };

  const openModal = (dayId, isEdit = false, isExercise = false) => {
    console.log('Opening modal for day ID:', dayId);
    setSelectedDayId(dayId);
    setModalIsOpen(true);
    if (isEdit) {
      const day = routine.days.find(day => day._id === dayId);
      setNewDay({ name: day.name });
      setIsEditing(true);
    }
    if (isExercise) {
      setIsCreatingExercise(true);
    }
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalIsOpen(false);
    setSelectedDayId(null);
    setIsCreatingDay(false);
    setIsCreatingExercise(false);
    setIsEditing(false);
    setNewDay({ name: '' });
    setNewExercise({ name: '', repetition: '', serie: '', weight: '' });
  };

  const handleAddExercise = (dayId) => {
    console.log(`Agregar ejercicio al día con ID: ${dayId}`);
    setSelectedDayId(dayId);
    setIsCreatingExercise(true);
    setModalIsOpen(true);
  };

  const handleEditDayName = (dayId) => {
    openModal(dayId, true);
  };

  const handleDeleteDay = async (dayId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este día?')) {
      try {
        // Llamada a la API para eliminar el día de la rutina
        const response = await fetch('http://localhost:3000/routines/removeDayFromRoutine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ routineId: id, dayId: dayId }),
        });

        if (!response.ok) {
          throw new Error('Error removing day from routine');
        }

        const updatedRoutine = await response.json();

        // Actualizar el estado de la rutina
        setRoutine(updatedRoutine);
        closeModal();
      } catch (error) {
        console.error('Error removing day from routine:', error);
        alert('Error removing day from routine');
      }
    }
  };

  const handleSubmitNewDay = async (e) => {
    e.preventDefault();
    try {
      // Llamada a la API para crear un nuevo día
      const response = await fetch('http://localhost:3000/day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDay),
      });

      if (!response.ok) {
        throw new Error('Error creating new day');
      }

      const createdDay = await response.json();

      // Llamada a la API para añadir el día a la rutina
      const addDayResponse = await fetch('http://localhost:3000/routines/add-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routineId: id, dayId: createdDay._id }),
      });

      if (!addDayResponse.ok) {
        throw new Error('Error adding day to routine');
      }

      const updatedRoutine = await addDayResponse.json();

      // Actualizar el estado de la rutina combinando los días existentes con el nuevo día
      setRoutine(prevRoutine => ({
        ...prevRoutine,
        days: [...prevRoutine.days, createdDay],
      }));

      closeModal();
    } catch (error) {
      console.error('Error creating and adding new day:', error);
      alert('Error creating and adding new day');
    }
  };


  const handleSubmitNewExercise = async (e) => {
    e.preventDefault();
    // Llamada a la API para crear un nuevo ejercicio
    const response = await fetch('http://localhost:3000/exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExercise),
    });
    const createdExercise = await response.json();

    // Llamada a la API para añadir el ejercicio al día
    const dayResponse = await fetch('http://localhost:3000/days/add-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dayId: selectedDayId, exerciseId: createdExercise.exercise._id }),
    });
    const updatedDay = await dayResponse.json();

    // Actualizar el estado de la rutina
    setRoutine(prevRoutine => ({
      ...prevRoutine,
      days: prevRoutine.days.map(day => (day._id === selectedDayId ? updatedDay : day)),
    }));

    closeModal();
  };

  const handleSubmitEditDay = async (e) => {
    e.preventDefault();
    // Llamada a la API para actualizar el día
    const response = await fetch(`http://localhost:3000/days/${selectedDayId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDay),
    });
    const updatedDay = await response.json();

    // Actualizar el estado de la rutina
    setRoutine(prevRoutine => ({
      ...prevRoutine,
      days: prevRoutine.days.map(day => (day._id === selectedDayId ? updatedDay : day)),
    }));

    closeModal();
  };

  const handleDayAdded = () => {
    fetchRoutine();
  };

  const handleAddDay = () => {
    setIsCreatingDay(true);
    setModalIsOpen(true);
  };

  if (!routine) return <div>Cargando...</div>;

  return (
    <div className="container">
      <div className="container">
        <RoutineHeader routine={routine} />
        <DayCarousel routineId={id} onDayAdded={handleDayAdded} onAddDay={handleAddDay} />
      </div>
      <div>
        {routine.days && routine.days.length > 0 ? (
          routine.days.map((day, index) => (
            <DayRoutineCard
              key={index}
              day={day}
              onAddExercise={handleAddExercise}
              onEditDay={handleEditDayName}
              onDeleteDay={handleDeleteDay}
            />
          ))
        ) : (
          <p>No days available</p>
        )}
      </div>
      <RoutineModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        isCreatingDay={isCreatingDay}
        isCreatingExercise={isCreatingExercise}
        isEditing={isEditing}
        newDay={newDay}
        newExercise={newExercise}
        selectedDayId={selectedDayId}
        handleSubmitNewDay={handleSubmitNewDay}
        handleSubmitNewExercise={handleSubmitNewExercise}
        handleSubmitEditDay={handleSubmitEditDay}
        fetchRoutine={fetchRoutine}
        setNewDay={setNewDay}
        setNewExercise={setNewExercise}
      />
    </div>
  );
}

export default RoutineDetail;
