// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true } // Campo para almacenar el ID de Google
});

// Pre-hook para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Encriptar la contraseña con un salt de 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
