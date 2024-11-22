// src/pages/HomePage.js
import React from 'react';
import RoutineCard from '../components/RoutineComponents/RoutineCard';
import ExerciseCard from '../components/ExerciseComponents/ExerciseCard';
import DayCard from '../components/DayComponents/DayCard';


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
