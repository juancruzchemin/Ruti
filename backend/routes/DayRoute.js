const express = require('express');
const router = express.Router();
const dayController = require('../controllers/DayController'); // Asumiendo que creas un archivo para los controladores
const authenticate = require('../middleware/isAuthenticated');


// CRUD para Day
router.post('/day', authenticate, dayController.createDay);       // Crear un Day
router.get('/days/', authenticate, dayController.getAllDays);       // Obtener todos los Days
router.get('/days/:id', authenticate, dayController.getDay);       // Obtener un Day
router.put('/days/:id', authenticate, dayController.updateDay);    // Actualizar un Day
router.delete('/days/:id', authenticate, dayController.deleteDay); // Eliminar un Day

module.exports = router;
