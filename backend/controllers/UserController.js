const mongoose = require('mongoose');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken'); // Para generar un token
const bcrypt = require('bcryptjs');

// Función para registrar al usuario
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: 'Usuario ya registrado' });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            email,
            password
        });

        // Guardar el nuevo usuario
        await newUser.save();

        // Generar un token para el usuario recién registrado (opcional)
        const token = jwt.sign({ userId: newUser._id }, 'tu_secreto', { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al registrar al usuario' });
    }
};

// Función para iniciar sesión al usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token para el usuario
        const token = jwt.sign({ userId: user._id }, 'tu_secreto', { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al iniciar sesión' });
    }
};


module.exports = {
    registerUser,
    loginUser
};