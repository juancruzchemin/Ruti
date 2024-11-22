const mongoose = require('mongoose');
const Day = require('../models/DayModel');
const Routine = require('../models/RoutineModel');

//CRUD
const createDay = async (req, res) => {
    const { name } = req.body;
    const newDay = new Day({
        name
    });
       
    try {
        await newDay.save();
        res.status(201).json(newDay);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el dia', error: err });
    }
};

const getAllDays = async (req, res) => {
    try {
        const days = await Day.find().populate('exercises'); // Popula los ejercicios
        res.status(200).json(days); // Devuelve los días en formato JSON
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los días', error: err });
    }
};

const getDay = async (req, res) => {
    const day = await Day.findById(req.params.id);
    res.json(day);
};

const updateDay = async (req, res) => {
    const day = await Day.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(day);
};

const deleteDay = async (req, res) => {
    const { dayId } = req.params;
  
    try {
      // Eliminar el día de la colección de días
      const deletedDay = await Day.findByIdAndDelete(dayId);
  
      if (!deletedDay) {
        return res.status(404).json({ message: 'Day not found' });
      }
  
      // Eliminar el día de todas las rutinas que lo contienen
      await Routine.updateMany(
        { days: dayId },
        { $pull: { days: dayId } }
      );
  
      res.status(200).json({ message: 'Day deleted successfully' });
    } catch (error) {
      console.error('Error deleting day:', error);
      res.status(500).json({ message: 'Error deleting day' });
    }
  };
  


module.exports = { createDay, getAllDays, getDay, updateDay, deleteDay };


  

  