const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path'); // Importa el módulo path
const routineRoutes = require('./routes/authRoute');
const dayRoutes = require('./routes/DayRoute');
const exerciseRoutes = require('./routes/ExerciseRoute');
require('./config/passport'); // Asegúrate de requerir el archivo passport.js

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// URL de conexión (puede ser 'mongodb://localhost:27017' para local)
mongoose.connect('mongodb://localhost:27017/Ruti', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');
})
.catch(err => {
  console.log('Error al conectar a MongoDB:', err);
});

// Importa las rutas de las rutinas
app.use(routineRoutes);
app.use(dayRoutes);
app.use(exerciseRoutes);

// //Autentication
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Incluir rutas de autenticación
// const authRoutes = require('./routes/authRoute');
// app.use(authRoutes);

// Sirve los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, './frontend/ruti-front')));

// Maneja todas las rutas no específicas y redirige al index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/ruti-front', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
