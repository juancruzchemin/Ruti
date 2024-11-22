import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ExerciseCarousel from '../ExerciseComponents/ExerciseCarousel'; // Importa el componente ExerciseCarousel
import '../styles/RoutineStyles/RoutineModal.css'

function RoutineModal({
  modalIsOpen,
  closeModal,
  isCreatingDay,
  isCreatingExercise,
  isEditing,
  newDay,
  newExercise,
  selectedDayId,
  handleSubmitNewDay,
  handleSubmitNewExercise,
  handleSubmitEditDay,
  fetchRoutine,
  setNewDay, // Asegúrate de que setNewDay se pase como prop
  setNewExercise // Asegúrate de que setNewExercise se pase como prop
}) {
  return (
    <Modal show={modalIsOpen} onHide={closeModal} size="lg" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {isCreatingDay ? 'Agregar Nuevo Día' : isCreatingExercise ? 'Agregar Nuevo Ejercicio' : 'Editar Día'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isCreatingDay && (
          <Form onSubmit={handleSubmitNewDay} className="form-container">
            <Form.Group controlId="formDayName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newDay.name}
                onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Crear
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </Form>
        )}
        {isCreatingExercise && (
          <div className='form-container'>
            <ExerciseCarousel dayId={selectedDayId} onExerciseAdded={fetchRoutine} />
            <Form onSubmit={handleSubmitNewExercise}>
              <Form.Group controlId="formExerciseName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formExerciseRepetition">
                <Form.Label>Repeticiones</Form.Label>
                <Form.Control
                  type="number"
                  value={newExercise.repetition}
                  onChange={(e) => setNewExercise({ ...newExercise, repetition: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formExerciseSerie">
                <Form.Label>Series</Form.Label>
                <Form.Control
                  type="number"
                  value={newExercise.serie}
                  onChange={(e) => setNewExercise({ ...newExercise, serie: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formExerciseWeight">
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="number"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Crear
              </Button>
              <Button variant="secondary" onClick={closeModal}>
                Cerrar
              </Button>
            </Form>
          </div>
        )}
        {isEditing && (
          <Form onSubmit={handleSubmitEditDay} className="form-container">
            <Form.Group controlId="formDayName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newDay.name}
                onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default RoutineModal;
