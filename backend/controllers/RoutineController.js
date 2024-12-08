const mongoose = require('mongoose');
const Routine = require('../models/RoutineModel');
const jwt = require('jsonwebtoken'); // Para generar un token

const createRoutine = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;
        const userId = req.user._id; // Asumiendo que el usuario está disponible en req.user

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
    try {
        const routine = await Routine.findById(req.params.id)
            .populate({
                path: 'days',
                populate: {
                    path: 'exercises'
                }
            });
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }
        res.json(routine);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching routine', error: error.message });
    }
};

const getAllRoutines = async (req, res) => {
    try {
        const routines = await Routine.find()
            .populate({
                path: 'days',
                populate: {
                    path: 'exercises'
                }
            }); // Devuelve todas las rutinas con días y ejercicios poblados
        res.status(200).json(routines); // Devuelve las rutinas en formato JSON
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las rutinas', error: err });
    }
};

const updateRoutine = async (req, res) => {
    try {
        const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate({
                path: 'days',
                populate: {
                    path: 'exercises'
                }
            });
        res.json(routine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating routine', error: error.message });
    }
};

const deleteRoutine = async (req, res) => {
    try {
        await Routine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Routine deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting routine', error: error.message });
    }
};

// Special actions
const addDayToRoutine = async (req, res) => {
    const { routineId, dayId } = req.body;

    try {
        const routine = await Routine.findById(routineId);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
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
        console.error('Error adding day to routine:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const removeDayFromRoutine = async (req, res) => {
    const { routineId, dayId } = req.body;

    try {
        const routine = await Routine.findById(routineId);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
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
        console.error('Error removing day from routine:', error);
        console.error('Routine ID:', routineId);
        console.error('Day ID:', dayId);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { createRoutine, getRoutine, getAllRoutines, updateRoutine, deleteRoutine, addDayToRoutine, removeDayFromRoutine };
