const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Campo de usuario
  name: String,
  repetition: Number,
  serie: Number,
  weight: Number,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;