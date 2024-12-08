import React, { useState } from 'react';
import { format } from 'date-fns';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/RoutineStyles/RoutineHeader.css'; // Importar el archivo CSS

function RoutineHeader({ routine, onAddDay, onEditRoutine, onDeleteRoutine }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: routine.name,
    startDate: routine.startDate ? routine.startDate.split('T')[0] : '',
    endDate: routine.endDate ? routine.endDate.split('T')[0] : ''
  });

  const formattedStartDate = routine.startDate ? format(new Date(routine.startDate), 'dd/MM/yyyy') : 'Fecha no disponible';
  const formattedEndDate = routine.endDate ? format(new Date(routine.endDate), 'dd/MM/yyyy') : 'Fecha no disponible';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación

      const response = await fetch(`http://localhost:3000/routines/${routine._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error updating routine');
      }

      const updatedRoutine = await response.json();
      onEditRoutine(updatedRoutine); // Llamar a la función onEditRoutine con la rutina actualizada
      setShowEditModal(false); // Cerrar el modal
    } catch (error) {
      console.error('Error updating routine:', error);
      alert('Error updating routine');
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        <h1>{routine.name}</h1>
        <Dropdown className="dropdown">
          <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
            ⋮
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onAddDay}>Agregar día</Dropdown.Item>
            <Dropdown.Item onClick={() => setShowEditModal(true)}>Editar rutina</Dropdown.Item>
            <Dropdown.Item onClick={onDeleteRoutine}>Eliminar rutina</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
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

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Rutina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Fecha de Fin</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RoutineHeader;
