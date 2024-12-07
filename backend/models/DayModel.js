const mongoose = require('mongoose');
const Exercise = require('./ExerciseModel'); // Asegúrate de ajustar la ruta según tu estructura de archivos

const DaySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Campo de usuario
  name: String,
  date: Date,
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }], // Almacena referencias a objetos Exercise
});

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;
