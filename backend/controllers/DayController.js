const mongoose = require('mongoose');
const Day = require('../models/DayModel');
const Routine = require('../models/RoutineModel');

// CRUD
const createDay = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  const newDay = new Day({
    name,
    user: userId
  });

  try {
    await newDay.save();
    res.status(201).json(newDay);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el día', error: err });
  }
};

const getAllDays = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const days = await Day.find({ user: userId }).populate('exercises'); // Popula los ejercicios
    res.status(200).json(days); // Devuelve los días en formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los días', error: err });
  }
};

const getDay = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user
  const day = await Day.findOne({ _id: req.params.id, user: userId }).populate('exercises');

  if (!day) {
    return res.status(404).json({ message: 'Día no encontrado' });
  }

  res.json(day);
};

const updateDay = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user
  const day = await Day.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });

  if (!day) {
    return res.status(404).json({ message: 'Día no encontrado' });
  }

  res.json(day);
};

const deleteDay = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user
  const { dayId } = req.params;

  try {
    // Eliminar el día de la colección de días
    const deletedDay = await Day.findOneAndDelete({ _id: dayId, user: userId });

    if (!deletedDay) {
      return res.status(404).json({ message: 'Día no encontrado' });
    }

    // Eliminar el día de todas las rutinas que lo contienen
    await Routine.updateMany(
      { days: dayId },
      { $pull: { days: dayId } }
    );

    res.status(200).json({ message: 'Día eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el día:', error);
    res.status(500).json({ message: 'Error al eliminar el día' });
  }
};

module.exports = { createDay, getAllDays, getDay, updateDay, deleteDay };
