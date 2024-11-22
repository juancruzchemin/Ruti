// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import RoutineDetail from './pages/Routinepage';
import DayDetail from './pages/Dayspage';
import ExerciseDetails from './pages/Exercisepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/GeneralComponents/SideBar';
import Header from './components/GeneralComponents/Header';
import Footer from './components/GeneralComponents/Footer';


function App() {
  return (
    <div>
      <SideBar />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/routines/:id" element={<RoutineDetail />} />
        <Route path="/days/:id" element={<DayDetail />} />
        <Route path="/exercises/:id" element={<ExerciseDetails />} />
      </Routes>
      <Footer />
    </div>


  );
}

export default App;
