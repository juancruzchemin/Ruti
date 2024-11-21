import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import ExerciseCarousel from '../components/AllExercisesCarousel';
import '../components/styles/ExercisePage.css';

function ExerciseDetails() {
  const { id } = useParams();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', repetition: '', serie: '', weight: '' });
  const [editingFields, setEditingFields] = useState({});
  const inputRefs = useRef({});


  useEffect(() => {
    if (id) {
      // Llamada a la API para obtener el ejercicio por su ID
      fetch(`http://localhost:3000/exercises/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setSelectedExercise(data);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [id]);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleEditExercise = () => {
    setEditingFields({
      name: true,
      repetition: true,
      serie: true,
      weight: true,
    });
    setEditedValues({
      name: selectedExercise.name,
      repetition: selectedExercise.repetition,
      serie: selectedExercise.serie,
      weight: selectedExercise.weight,
    });
  };

  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  const handleBlur = async (field) => {
    try {
      // Actualizar el ejercicio en el backend
      const response = await fetch(`http://localhost:3000/exercises/${selectedExercise._id}`, {
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
      setSelectedExercise(updatedExercise);
      setEditingFields((prevFields) => ({ ...prevFields, [field]: false }));
    } catch (error) {
      console.error('Error updating exercise:', error);
      alert('Error updating exercise');
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      handleBlur(field);
    }
  };

  const handleAddExercise = async () => {
    try {
      // Llamada a la API para crear un nuevo ejercicio
      const response = await fetch('http://localhost:3000/exercises', {
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

      // Actualizar el estado del componente para incluir el nuevo ejercicio
      setSelectedExercise(createdExercise);
      setShowAddExerciseModal(false);
      setNewExercise({ name: '', repetition: '', serie: '', weight: '' });
    } catch (error) {
      console.error('Error creating new exercise:', error);
      alert('Error creating new exercise');
    }
  };

  const handleDeleteExercise = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este ejercicio?')) {
      try {
        // Llamada a la API para eliminar el ejercicio
        const response = await fetch(`http://localhost:3000/exercises/${selectedExercise._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error deleting exercise');
        }

        // Limpiar el estado del ejercicio seleccionado
        setSelectedExercise(null);
        alert('Ejercicio eliminado con éxito');
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise');
      }
    }
  };

  return (
    <div className="container">
      <ExerciseCarousel onExerciseClick={handleExerciseClick} onAddExerciseClick={() => setShowAddExerciseModal(true)} />
      {selectedExercise ? (
        <div>
          <ul className="exercise-list">
            <li className="exercise-item">
              <div className="exercise-column">
                {editingFields.name ? (
                  <input
                    ref={(el) => (inputRefs.current.name = el)}
                    type="text"
                    value={editedValues.name}
                    onChange={(e) => handleChange(e, 'name')}
                    onBlur={() => handleBlur('name')}
                    onKeyDown={(e) => handleKeyDown(e, 'name')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleEditExercise('name')}>{selectedExercise.name}</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingFields.repetition ? (
                  <input
                    ref={(el) => (inputRefs.current.repetition = el)}
                    type="number"
                    value={editedValues.repetition}
                    onChange={(e) => handleChange(e, 'repetition')}
                    onBlur={() => handleBlur('repetition')}
                    onKeyDown={(e) => handleKeyDown(e, 'repetition')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleEditExercise('repetition')}>{selectedExercise.repetition} Repetitions</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingFields.serie ? (
                  <input
                    ref={(el) => (inputRefs.current.serie = el)}
                    type="number"
                    value={editedValues.serie}
                    onChange={(e) => handleChange(e, 'serie')}
                    onBlur={() => handleBlur('serie')}
                    onKeyDown={(e) => handleKeyDown(e, 'serie')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleEditExercise('serie')}>{selectedExercise.serie} Series</h1>
                )}
              </div>
              <div className="exercise-column">
                {editingFields.weight ? (
                  <input
                    ref={(el) => (inputRefs.current.weight = el)}
                    type="number"
                    value={editedValues.weight}
                    onChange={(e) => handleChange(e, 'weight')}
                    onBlur={() => handleBlur('weight')}
                    onKeyDown={(e) => handleKeyDown(e, 'weight')}
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => handleEditExercise('weight')}>{selectedExercise.weight} Kg</h1>
                )}
              </div>
              <Dropdown>
                <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowAddExerciseModal(true)}>Agregar ejercicio</Dropdown.Item>
                  {/* <Dropdown.Item onClick={handleEditExercise}>Editar ejercicio</Dropdown.Item> */}
                  <Dropdown.Item onClick={handleDeleteExercise}>Eliminar ejercicio</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          {/* Mostrar otros detalles como ejercicios, etc. */}
        </div>
      ) : (
        <div>Seleccione un ejercicio para ver los detalles</div>
      )}

      {/* Modal para agregar ejercicio */}
      <Modal show={showAddExerciseModal} onHide={() => setShowAddExerciseModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowAddExerciseModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddExercise}>
            Agregar Ejercicio
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExerciseDetails;