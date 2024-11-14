const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: String,
    repetition: Number,
    serie: Number,
    weight: Number,
    // exerciseAssocied: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }
  });

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;