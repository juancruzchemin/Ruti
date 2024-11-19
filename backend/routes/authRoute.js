const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');
const routineController = require('../controllers/RoutineController');
const exerciseController = require('../controllers/ExerciseController');
const dayController = require('../controllers/DayController');

const express = require('express');
const router = express.Router();

// Rutas para Rutinas (solo accesibles para usuarios autenticados)
router.post('/routine', routineController.createRoutine);
router.get('/routines', routineController.getAllRoutines);
router.get('/routines/:id', routineController.getRoutine);
router.put('/routines/:id', routineController.updateRoutine);
router.delete('/routines/:id', routineController.deleteRoutine);


router.post('/routines/add-day', routineController.addDayToRoutine);
router.post('/routines/removeDayFromRoutine', routineController.removeDayFromRoutine);

router.post('/days/add-exercise', exerciseController.addExerciseToDay);
router.post('/days/removeExerciseFromDay', exerciseController.removeExerciseFromDay);


// // Importa el controlador o la función de la ruta
// const { registerUser } = require('../controllers/RoutineController'); // Ejemplo ajusta segun tu código

// // Asegúrate de que la ruta esté definida correctamente
// router.post('/register', registerUser);

// //Autentication
// // Rutas para Google
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/'
// }));

// // Rutas para Facebook
// router.get('/auth/facebook', passport.authenticate('facebook'));
// router.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/'
// }));

// router.post('/delete-facebook-user-data', async (req, res) => {
//   try {
//       // Obtén el user_id del usuario enviado por Facebook.
//       // Puede que necesites almacenar este `user_id` en la base de datos durante la autenticación inicial.
//       const facebookUserId = req.body.user_id; // Asegúrate de que el id esté incluido en el request body

//       if (!facebookUserId) {
//           return res.status(400).json({ message: 'El user_id de Facebook es requerido.' });
//       }

//       // Encuentra al usuario en tu base de datos usando el `facebookUserId`
//       const user = await User.findOne({ facebookId: facebookUserId });

//       if (!user) {
//           return res.status(404).json({ message: 'Usuario no encontrado.' });
//       }

//       // Elimina al usuario de la base de datos
//       await user.deleteOne({ facebookId: facebookUserId });

//       // Envía una respuesta de confirmación a Facebook
//       res.status(200).json({
//           message: 'Los datos del usuario han sido eliminados satisfactoriamente.',
//           status: 'success',
//       });
//   } catch (error) {
//       console.error('Error eliminando los datos del usuario:', error);
//       res.status(500).json({
//           message: 'Ocurrió un error al intentar eliminar los datos del usuario.',
//           status: 'error',
//       });
//   }
// });

// // Ruta de logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

module.exports = router;
