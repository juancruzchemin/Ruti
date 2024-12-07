const mongoose = require('mongoose');
const Routine = require('../models/RoutineModel');
const jwt = require('jsonwebtoken'); // Para generar un token

const createRoutine = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body; // Asumiendo que envías estos campos en el cuerpo de la solicitud
    const userId = req.user; // Suponiendo que el usuario está disponible en req.user

    // Crear una nueva rutina
    const newRoutine = new Routine({
      name,
      startDate,
      endDate,
      user: userId
    });

    // Guardar la nueva rutina en la base de datos
    await newRoutine.save();

    res.status(201).json({
      message: 'Rutina creada con éxito',
      routine: newRoutine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al crear la rutina' });
  }
};

const getRoutine = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routine = await Routine.findOne({ _id: req.params.id, user: userId })
      .populate({
        path: 'days',
        populate: {
          path: 'exercises'
        }
      });
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la rutina', error: error.message });
  }
};

const getAllRoutines = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routines = await Routine.find({ user: userId })
      .populate({
        path: 'days',
        populate: {
          path: 'exercises'
        }
      }); // Devuelve todas las rutinas del usuario con días y ejercicios poblados
    res.status(200).json(routines); // Devuelve las rutinas en formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las rutinas', error: err });
  }
};

const updateRoutine = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routine = await Routine.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true })
      .populate({
        path: 'days',
        populate: {
          path: 'exercises'
        }
      });
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la rutina', error: error.message });
  }
};

const deleteRoutine = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    res.json({ message: 'Rutina eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la rutina', error: error.message });
  }
};

// Acciones especiales
const addDayToRoutine = async (req, res) => {
  const { routineId, dayId } = req.body;
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routine = await Routine.findOne({ _id: routineId, user: userId });
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Añadir el día a la rutina si no está ya presente
    if (!routine.days.includes(dayId)) {
      routine.days.push(dayId);
    }

    await routine.save();

    // Popula los días para devolver el objeto completo en la respuesta
    await routine.populate({
      path: 'days',
      populate: {
        path: 'exercises'
      }
    });

    res.json(routine);
  } catch (error) {
    console.error('Error al agregar el día a la rutina:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const removeDayFromRoutine = async (req, res) => {
  const { routineId, dayId } = req.body;
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const routine = await Routine.findOne({ _id: routineId, user: userId });
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Filtra el array de días para eliminar el día con el ID especificado
    routine.days = routine.days.filter(day => day.toString() !== dayId);

    await routine.save();

    // Popula los días para devolver el objeto completo en la respuesta
    await routine.populate({
      path: 'days',
      populate: {
        path: 'exercises'
      }
    });

    res.json(routine);
  } catch (error) {
    console.error('Error al eliminar el día de la rutina:', error);
    console.error('Routine ID:', routineId);
    console.error('Day ID:', dayId);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

module.exports = { createRoutine, getRoutine, getAllRoutines, updateRoutine, deleteRoutine, addDayToRoutine, removeDayFromRoutine };
