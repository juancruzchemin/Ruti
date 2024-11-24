import React from 'react';
import { format } from 'date-fns';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/RoutineStyles/RoutineHeader.css'; // Importar el archivo CSS

function RoutineHeader({ routine, onAddDay, onEditRoutine, onDeleteRoutine }) {
  const formattedStartDate = routine.startDate ? format(new Date(routine.startDate), 'dd/MM/yyyy') : 'Fecha no disponible';
  const formattedEndDate = routine.endDate ? format(new Date(routine.endDate), 'dd/MM/yyyy') : 'Fecha no disponible';

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
            <Dropdown.Item onClick={onEditRoutine}>Editar rutina</Dropdown.Item>
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
    </div>
  );
}

export default RoutineHeader;
