import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import '../components/styles/Daypage.css';
import DaysCarouselPage from '../components/DaysCarouselPage';
import ExerciseCarousel from '../components/ExerciseCarousel';

function DayDetail() {
  const { id } = useParams();
  const [day, setDay] = useState(null);
  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', repetition: '', serie: '', weight: '' });
  const [editingDayName, setEditingDayName] = useState(false);
  const [newDayName, setNewDayName] = useState('');
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [newDay, setNewDay] = useState({ name: '' });

  useEffect(() => {
    // Llamada a la API para obtener el día por su ID
    fetchDay();
    fetchDays();
  }, [id]);

  const handleDayAdded = () => {
    fetchDay();
    fetchDays();
  };

  const fetchDay = async () => {
    try {
      const response = await fetch(`http://localhost:3000/days/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching day data');
      }
      const data = await response.json();
      setDay(data);
      setNewDayName(data.name);
      fetchExercises(data.exercises); // Llamada para obtener los detalles de los ejercicios
    } catch (error) {
      console.error('Error fetching day data:', error);
    }
  };

  const fetchDays = async () => {
    try {
      const response = await fetch('http://localhost:3000/days');
      if (!response.ok) {
        throw new Error('Error fetching days data');
      }
      const data = await response.json();
      setDays(data);
    } catch (error) {
      console.error('Error fetching days data:', error);
    }
  };

  const fetchExercises = async (exerciseIds) => {
    try {
      const exercisePromises = exerciseIds.map(async (exerciseId) => {
        const response = await fetch(`http://localhost:3000/exercises/${exerciseId}`);
        if (!response.ok) {
          throw new Error(`Error fetching exercise data for ID: ${exerciseId}`);
        }
        return response.json();
      });

      const exercisesData = await Promise.all(exercisePromises);
      setExercises(exercisesData);
    } catch (error) {
      console.error('Error fetching exercises data:', error);
    }
  };

  const handleDoubleClick = (exercise, field) => {
    setEditingExercise({ exerciseId: exercise._id, field });
    setEditedValues({ ...editedValues, [field]: exercise[field] });
  };

  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  const handleBlur = async (exercise, field) => {
    try {
      // Actualizar el ejercicio en el backend
      const response = await fetch(`http://localhost:3000/exercises/${exercise._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: editedValues[field] }),
      });

      if (!response.ok) {
        throw new Error('Error updating exercise');
      }

      const updatedExercise = await response.json();

      // Actualizar el ejercicio en el estado local
      setExercises((prevExercises) =>
        prevExercises.map((ex) => (ex._id === exercise._id ? updatedExercise : ex))
      );
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
    if (window.confirm('¿Está seguro de que desea eliminar este ejercicio?')) {
      try {
        // Llamada a la API para eliminar el ejercicio del día
        const response = await fetch('http://localhost:3000/days/removeExerciseFromDay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dayId: id, exerciseId }),
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
    }
  };

  const handleAddExercise = async () => {
    try {
      // Llamada a la API para crear un nuevo ejercicio
      const response = await fetch('http://localhost:3000/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExercise),
      });

      if (!response.ok) {
        throw new Error('Error creating new exercise');
      }

      const createdExercise = await response.json();

      // Llamada a la API para añadir el ejercicio al día
      const addExerciseResponse = await fetch('http://localhost:3000/days/add-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dayId: id, exerciseId: createdExercise._id }),
      });

      if (!addExerciseResponse.ok) {
        throw new Error('Error adding exercise to day');
      }

      const updatedDay = await addExerciseResponse.json();

      // Actualizar el estado del día
      setExercises(updatedDay.exercises);
      setShowModal(false);
      setNewExercise({ name: '', repetition: '', serie: '', weight: '' });
    } catch (error) {
      console.error('Error creating and adding new exercise:', error);
      alert('Error creating and adding new exercise');
    }
  };

  const handleEditDayName = async () => {
    try {
      // Llamada a la API para actualizar el nombre del día
      const response = await fetch(`http://localhost:3000/days/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDayName }),
      });

      if (!response.ok) {
        throw new Error('Error updating day name');
      }

      const updatedDay = await response.json();
      setDay(updatedDay);
      setEditingDayName(false);
    } catch (error) {
      console.error('Error updating day name:', error);
      alert('Error updating day name');
    }
  };

  const handleDeleteDay = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este día?')) {
      try {
        // Llamada a la API para eliminar el día
        const response = await fetch(`http://localhost:3000/days/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error deleting day');
        }

        const newDays = await response.json();

        // Redirigir o actualizar la interfaz según sea necesario
        setDays(newDays);
        alert('Día eliminado con éxito');
      } catch (error) {
        console.error('Error deleting day:', error);
        alert('Error deleting day');
      }
    }
  };

  const handleAddDay = async () => {
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
  
      // Actualizar el estado del componente para incluir el nuevo día
      setShowAddDayModal(false);
      setDays((prevDays) => [...prevDays, createdDay]);      
      setNewDay({ name: '' });
    } catch (error) {
      console.error('Error creating new day:', error);
      alert('Error creating new day');
    }
  };

  if (!day) return <div>Cargando...</div>;

  return (
    <div className="container">
      <div>
        <DaysCarouselPage days={days} onDayAdded={handleDayAdded} onAddDayClick={() => setShowAddDayModal(true)} />
      </div>
      <div className="day-title">
        <h1>
          {editingDayName ? (
            <input
              type="text"
              value={newDayName}
              onChange={(e) => setNewDayName(e.target.value)}
              onBlur={handleEditDayName}
              onKeyDown={(e) => e.key === 'Enter' && handleEditDayName()}
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => setEditingDayName(true)}>{day.name}</span>
          )}
        </h1>
        <Dropdown>
          <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
            ⋮
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowModal(true)}>Agregar ejercicio</Dropdown.Item>
            <Dropdown.Item onClick={() => setEditingDayName(true)}>Editar día</Dropdown.Item>
            <Dropdown.Item onClick={handleDeleteDay}>Eliminar Día</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ul className="exercise-list">
        {exercises.length > 0 ? (
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
                  <h1 onDoubleClick={() => handleDoubleClick(exercise, 'name')}>{exercise.name}</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'repetition' ? (
                  <input
                    type="number"
                    value={editedValues.repetition}
                    onChange={(e) => handleChange(e, 'repetition')}
                    onBlur={() => handleBlur(exercise, 'repetition')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'repetition')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleDoubleClick(exercise, 'repetition')}>{exercise.repetition}</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'serie' ? (
                  <input
                    type="number"
                    value={editedValues.serie}
                    onChange={(e) => handleChange(e, 'serie')}
                    onBlur={() => handleBlur(exercise, 'serie')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'serie')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleDoubleClick(exercise, 'serie')}>{exercise.serie}</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingExercise && editingExercise.exerciseId === exercise._id && editingExercise.field === 'weight' ? (
                  <input
                    type="number"
                    value={editedValues.weight}
                    onChange={(e) => handleChange(e, 'weight')}
                    onBlur={() => handleBlur(exercise, 'weight')}
                    onKeyDown={(e) => handleKeyDown(e, exercise, 'weight')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleDoubleClick(exercise, 'weight')}>{exercise.weight}</h1>
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

      {/* Modal para agregar ejercicio */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <ExerciseCarousel dayId={id} onExerciseAdded={fetchDay} />
        <Modal.Header closeButton>
          <Modal.Title>Agregar Ejercicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formExerciseName">
              <Form.Label>Nombre del Ejercicio</Form.Label>
              <Form.Control
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formExerciseRepetition">
              <Form.Label>Repeticiones</Form.Label>
              <Form.Control
                type="number"
                value={newExercise.repetition}
                onChange={(e) => setNewExercise({ ...newExercise, repetition: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formExerciseSerie">
              <Form.Label>Series</Form.Label>
              <Form.Control
                type="number"
                value={newExercise.serie}
                onChange={(e) => setNewExercise({ ...newExercise, serie: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formExerciseWeight">
              <Form.Label>Peso</Form.Label>
              <Form.Control
                type="number"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddExercise}>
            Agregar Ejercicio
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar día */}
      <Modal show={showAddDayModal} onHide={() => setShowAddDayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Día</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDayName">
              <Form.Label>Nombre del Día</Form.Label>
              <Form.Control
                type="text"
                value={newDay.name}
                onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddDayModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddDay}>
            Agregar Día
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default DayDetail;
