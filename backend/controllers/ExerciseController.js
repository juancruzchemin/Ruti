const Exercise = require('../models/ExerciseModel');

//CRUD
const createExercise = async (req, res) => {
    try {
        const { name, repetition, serie, weight  } = req.body;
        const exercise = new Exercise({
            name,
            repetition,
            serie,
            weight        
        });

        // Guardar el nuevo ejercicio en la base de datos
        await exercise.save();

        res.status(201).json({
            message: 'Ejercicio creada con éxito',
            exercise
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al crear el ejercicio' });
    }
};

const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find(); // Devuelve todas las rutinas
        res.status(200).json(exercises); // Devuelve las rutinas en formato JSON
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las rutinas', error: err });
    }
};

const getExercise = async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
    res.json(exercise);
};

const updateExercise = async (req, res) => {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exercise);
};

const deleteExercise = async (req, res) => {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercise deleted' });
};

//special actions
const addExerciseToDay = async (req, res) => {
    const { dayId, exerciseId } = req.body;

    const day = await Exercise.findById(dayId);
    day.exercises.push(exerciseId);
    await day.save();

    res.json(day);
};


module.exports = { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise, addExerciseToDay };




