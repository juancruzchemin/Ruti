import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; // Importar el icono de eliminación
import '../styles/DayStyles/DayRoutineCard.css'; // Importar el archivo CSS

function DayCard({ day, onAddExercise, onEditDay, onDeleteDay }) {
  const [editingExercise, setEditingExercise] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [exercises, setExercises] = useState(day.exercises);

  const handleDoubleClick = (exercise, field) => {
    setEditingExercise({ exerciseId: exercise._id, field });
    setEditedValues({ ...editedValues, [field]: exercise[field] });
  };

  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  const handleBlur = async (exercise, field) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación

      // Actualizar el ejercicio en el backend
      const response = await fetch(`http://localhost:3000/exercises/${exercise._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
        },
        body: JSON.stringify({ [field]: editedValues[field] }),
      });

      if (!response.ok) {
        throw new Error('Error updating exercise');
      }

      const updatedExercise = await response.json();

      // Actualizar el ejercicio en el estado local
      setExercises(exercises.map(ex => ex._id === exercise._id ? updatedExercise : ex));
      setEditingExercise(null);
    } catch (error) {
      console.error('Error updating exercise:', error);
      alert('Error updating exercise');
    }
  };

  const handleKeyDown = (e, exercise, field) => {
    if (e.key === 'Enter') {
      handleBlur(exercise, field);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación

      // Llamada a la API para eliminar el ejercicio del día
      const response = await fetch('http://localhost:3000/days/removeExerciseFromDay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
        },
        body: JSON.stringify({ dayId: day._id, exerciseId }),
      });

      if (!response.ok) {
        throw new Error('Error removing exercise from day');
      }

      const updatedDay = await response.json();

      // Actualizar el estado del día en el estado local
      setExercises(updatedDay.exercises);
    } catch (error) {
      console.error('Error removing exercise from day:', error);
      alert('Error removing exercise from day');
    }
  };

  return (
    <div className="day-card">
      <div className="day-title">
        {day.name}
        <Dropdown>
          <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
            ⋮
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onAddExercise(day._id)}>Agregar ejercicio</Dropdown.Item>
            <Dropdown.Item onClick={() => onEditDay(day._id)}>Editar día</Dropdown.Item>
            <Dropdown.Item onClick={() => onDeleteDay(day._id)}>Eliminar Día</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ul className="exercise-list">
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise, exerciseIndex) => (
            <li key={exerciseIndex} className="exercise-item">
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'name' ? (
                  <input
                    type="text"
                    value={editedValues.name}
                    onChange={(e) => handleChange(e, 'name')}
                    onBlur={() => handleBlur(exercise, 'name')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'name')}
                    autoFocus
                  />
                ) : (
                  <p onDoubleClick={() => handleDoubleClick(exercise, 'name')}>{exercise.name}</p>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'repetition' ? (
                  <input
                    type="text"
                    value={editedValues.repetition}
                    onChange={(e) => handleChange(e, 'repetition')}
                    onBlur={() => handleBlur(exercise, 'repetition')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'repetition')}
                    autoFocus
                  />
                ) : (
                  <p onDoubleClick={() => handleDoubleClick(exercise, 'repetition')}>{exercise.repetition} reps</p>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'serie' ? (
                  <input
                    type="text"
                    value={editedValues.serie}
                    onChange={(e) => handleChange(e, 'serie')}
                    onBlur={() => handleBlur(exercise, 'serie')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'serie')}
                    autoFocus
                  />
                ) : (
                  <p onDoubleClick={() => handleDoubleClick(exercise, 'serie')}>{exercise.serie} series</p>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'weight' ? (
                  <input
                    type="text"
                    value={editedValues.weight}
                    onChange={(e) => handleChange(e, 'weight')}
                    onBlur={() => handleBlur(exercise, 'weight')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'weight')}
                    autoFocus
                  />
                ) : (
                  <p onDoubleClick={() => handleDoubleClick(exercise, 'weight')}>{exercise.weight} Kg</p>
                )}
              </div>
              <div className="exercise-column">
                <FaTrash onClick={() => handleDeleteExercise(exercise._id)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
              </div>
            </li>
          ))
        ) : (
          <li className="exercise-item">No exercises</li>
        )}
      </ul>
    </div>
  );
}

export default DayCard;
