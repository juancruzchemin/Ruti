const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/ExerciseController'); // Asumiendo que creas un archivo para los controladores
const authenticate = require('../middleware/isAuthenticated');

// CRUD para Exercise
router.post('/exercise', authenticate, exerciseController.createExercise);       // Crear un Exercise
router.get('/exercises/', authenticate, exerciseController.getAllExercises); 
router.get('/exercises/:id', authenticate, exerciseController.getExercise);       // Obtener un Exercise
router.put('/exercises/:id', authenticate, exerciseController.updateExercise);    // Actualizar un Exercise
router.delete('/exercises/:id', authenticate, exerciseController.deleteExercise); // Eliminar un Exercise

module.exports = router;
