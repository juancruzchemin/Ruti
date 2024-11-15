// src/pages/HomePage.js
import React from 'react';
import RoutineCard from '../components/RoutineCard';
import ExerciseCard from '../components/ExerciseCard';
import DayCard from '../components/DayCard';


function HomePage() {
  return (
    <div>
      <RoutineCard title="Mis Rutinas" />
      <DayCard title="Mis dias" />
      <ExerciseCard title="Mis ejercicios" />
    </div>
  );
}

export default HomePage;
