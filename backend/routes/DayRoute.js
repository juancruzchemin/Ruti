const express = require('express');
const router = express.Router();
const dayController = require('../controllers/DayController'); // Asumiendo que creas un archivo para los controladores

// CRUD para Day
router.post('/day', dayController.createDay);       // Crear un Day
router.get('/days/', dayController.getAllDays);       // Obtener todos los Days
router.get('/days/:id', dayController.getDay);       // Obtener un Day
router.put('/days/:id', dayController.updateDay);    // Actualizar un Day
router.delete('/days/:id', dayController.deleteDay); // Eliminar un Day

module.exports = router;
