import React from 'react';
import { format } from 'date-fns';
import '../styles/RoutineStyles/RoutineHeader.css'; // Importar el archivo CSS

function RoutineHeader({ routine, onAddDay }) {
  const formattedStartDate = routine.startDate ? format(new Date(routine.startDate), 'dd/MM/yyyy') : 'Fecha no disponible';
  const formattedEndDate = routine.endDate ? format(new Date(routine.endDate), 'dd/MM/yyyy') : 'Fecha no disponible';

  return (
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
  );
}

export default RoutineHeader;
