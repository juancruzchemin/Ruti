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
import SignUp from './pages/SignUpPage';
import Login from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import './styles/GeneralStyles/App.css'; // Importa el archivo de estilos

function App() {
  return (
    <div className="app-container">
      <SideBar />
      <Header />
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute element={HomePage} />} />
          <Route path="/routines/:id" element={<ProtectedRoute element={RoutineDetail} />} />
          <Route path="/days/:id" element={<ProtectedRoute element={DayDetail} />} />
          <Route path="/exercises/:id" element={<ProtectedRoute element={ExerciseDetails} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
