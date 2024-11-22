const Exercise = require('../models/ExerciseModel');
const Day = require('../models/DayModel')

//CRUD
const createExercise = async (req, res) => {
    try {
        const { name, repetition, serie, weight } = req.body;
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
    try {
      const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      res.json(exercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  module.exports = { updateExercise };
  

  const deleteExercise = async (req, res) => {
    const { exerciseId } = req.params;
  
    try {
      // Eliminar el ejercicio de la colección de ejercicios
      const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
  
      if (!deletedExercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
  
      // Eliminar el ejercicio de todos los días que lo contienen
      await Day.updateMany(
        { exercises: exerciseId },
        { $pull: { exercises: exerciseId } }
      );
  
      res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
      console.error('Error deleting exercise:', error);
      res.status(500).json({ message: 'Error deleting exercise' });
    }
  };

// special actions
const addExerciseToDay = async (req, res) => {
    const { dayId, exerciseId } = req.body;

    try {
        const day = await Day.findById(dayId);
        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        day.exercises.push(exercise._id); // Almacena solo el ID del ejercicio
        await day.save();

        // Popula los ejercicios para devolver el objeto completo en la respuesta
        await day.populate('exercises');

        res.json(day);
    } catch (error) {
        console.error('Error adding exercise to day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// special actions
const removeExerciseFromDay = async (req, res) => {
    const { dayId, exerciseId } = req.body;
  
    try {
      const day = await Day.findById(dayId);
      if (!day) {
        return res.status(404).json({ message: 'Day not found' });
      }
  
      // Filtra el array de ejercicios para eliminar el ejercicio con el ID especificado
      day.exercises = day.exercises.filter(exercise => exercise.toString() !== exerciseId);
  
      await day.save();
  
      // Popula los ejercicios para devolver el objeto completo en la respuesta
      await day.populate('exercises');
  
      res.json(day);
    } catch (error) {
      console.error('Error removing exercise from day:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };



module.exports = { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise, addExerciseToDay, removeExerciseFromDay };




