const mongoose = require('mongoose');
const Routine = require('../models/RoutineModel');
const jwt = require('jsonwebtoken'); // Para generar un token

const createRoutine = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body; // Asumiendo que envías estos campos en el cuerpo de la solicitud
        // Crear una nueva rutina
        const newRoutine = new Routine({
            name,
            startDate,
            endDate
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
        const routines = await Routine.find(); // Devuelve todas las rutinas
        res.status(200).json(routines); // Devuelve las rutinas en formato JSON
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las rutinas', error: err });
    }
};

const updateRoutine = async (req, res) => {
    const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(routine);
};

const deleteRoutine = async (req, res) => {
    await Routine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Routine deleted' });
};

//special actions
const addDayToRoutine = async (req, res) => {
    const { routineId, dayId } = req.body;

    const routine = await Routine.findById(routineId);
    routine.days.push(dayId);
    await routine.save();

    res.json(routine);
};

module.exports = { createRoutine, getRoutine, getAllRoutines, updateRoutine, deleteRoutine, addDayToRoutine };
