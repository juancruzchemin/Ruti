const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    name: String,
    //exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
  });

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
