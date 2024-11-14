const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/ExerciseController'); // Asumiendo que creas un archivo para los controladores

// CRUD para Exercise
router.post('/exercise', exerciseController.createExercise);       // Crear un Exercise
router.get('/exercises/', exerciseController.getAllExercises); 
router.get('/exercises/:id', exerciseController.getExercise);       // Obtener un Exercise
router.put('/exercises/:id', exerciseController.updateExercise);    // Actualizar un Exercise
router.delete('/exercises/:id', exerciseController.deleteExercise); // Eliminar un Exercise

module.exports = router;
