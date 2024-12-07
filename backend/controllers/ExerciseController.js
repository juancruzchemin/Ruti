const Exercise = require('../models/ExerciseModel');
const Day = require('../models/DayModel');

// CRUD
const createExercise = async (req, res) => {
  try {
    const { name, repetition, serie, weight } = req.body;
    const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

    const exercise = new Exercise({
      name,
      repetition,
      serie,
      weight,
      user: userId
    });

    // Guardar el nuevo ejercicio en la base de datos
    await exercise.save();

    res.status(201).json({
      message: 'Ejercicio creado con éxito',
      exercise
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al crear el ejercicio' });
  }
};

const getAllExercises = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const exercises = await Exercise.find({ user: userId }); // Devuelve todos los ejercicios del usuario
    res.status(200).json(exercises); // Devuelve los ejercicios en formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los ejercicios', error: err });
  }
};

const getExercise = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user
  const exercise = await Exercise.findOne({ _id: req.params.id, user: userId });

  if (!exercise) {
    return res.status(404).json({ message: 'Ejercicio no encontrado' });
  }

  res.json(exercise);
};

const updateExercise = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const exercise = await Exercise.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });
    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    res.json(exercise);
  } catch (error) {
    console.error('Error al actualizar el ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const deleteExercise = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user
  const { exerciseId } = req.params;

  try {
    // Eliminar el ejercicio de la colección de ejercicios
    const deletedExercise = await Exercise.findOneAndDelete({ _id: exerciseId, user: userId });

    if (!deletedExercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    // Eliminar el ejercicio de todos los días que lo contienen
    await Day.updateMany(
      { exercises: exerciseId },
      { $pull: { exercises: exerciseId } }
    );

    res.status(200).json({ message: 'Ejercicio eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el ejercicio:', error);
    res.status(500).json({ message: 'Error al eliminar el ejercicio' });
  }
};

// Acciones especiales
const addExerciseToDay = async (req, res) => {
  const { dayId, exerciseId } = req.body;
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const day = await Day.findOne({ _id: dayId, user: userId });
    if (!day) {
      return res.status(404).json({ message: 'Día no encontrado' });
    }

    const exercise = await Exercise.findOne({ _id: exerciseId, user: userId });
    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    day.exercises.push(exercise._id); // Almacena solo el ID del ejercicio
    await day.save();

    // Popula los ejercicios para devolver el objeto completo en la respuesta
    await day.populate('exercises');

    res.json(day);
  } catch (error) {
    console.error('Error al agregar el ejercicio al día:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const removeExerciseFromDay = async (req, res) => {
  const { dayId, exerciseId } = req.body;
  const userId = req.user._id; // Suponiendo que el usuario está disponible en req.user

  try {
    const day = await Day.findOne({ _id: dayId, user: userId });
    if (!day) {
      return res.status(404).json({ message: 'Día no encontrado' });
    }

    // Filtra el array de ejercicios para eliminar el ejercicio con el ID especificado
    day.exercises = day.exercises.filter(exercise => exercise.toString() !== exerciseId);

    await day.save();

    // Popula los ejercicios para devolver el objeto completo en la respuesta
    await day.populate('exercises');

    res.json(day);
  } catch (error) {
    console.error('Error al eliminar el ejercicio del día:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

module.exports = { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise, addExerciseToDay, removeExerciseFromDay };
