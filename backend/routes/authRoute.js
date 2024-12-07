const routineController = require('../controllers/RoutineController');
const exerciseController = require('../controllers/ExerciseController');
const {registerUser, loginUser} = require('../controllers/UserController');
const authenticate = require('../middleware/isAuthenticated'); // Importa el middleware de autenticación

const express = require('express');
const router = express.Router();

// Rutas para Rutinas (solo accesibles para usuarios autenticados)
router.post('/routine', authenticate, routineController.createRoutine);
router.get('/routines', authenticate, routineController.getAllRoutines);
router.get('/routines/:id', authenticate, routineController.getRoutine);
router.put('/routines/:id', authenticate, routineController.updateRoutine);
router.delete('/routines/:id', authenticate, routineController.deleteRoutine);

router.post('/register', registerUser);
router.post('/login', loginUser);


router.post('/routines/add-day', authenticate, routineController.addDayToRoutine);
router.post('/routines/removeDayFromRoutine', authenticate, routineController.removeDayFromRoutine);

router.post('/days/add-exercise', authenticate, exerciseController.addExerciseToDay);
router.post('/days/removeExerciseFromDay', authenticate, exerciseController.removeExerciseFromDay);

module.exports = router;
