const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Campo de usuario
    name: { type: String, required: true },   
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    days: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Day' }] // Relación con el modelo Day
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;
