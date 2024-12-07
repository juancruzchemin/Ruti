const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');
const routineRoutes = require('./routes/authRoute');
const dayRoutes = require('./routes/DayRoute');
const exerciseRoutes = require('./routes/ExerciseRoute');
require('./config/passport'); // Asegúrate de requerir el archivo passport.js

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configura las sesiones
app.use(session({
secret: 'your_secret_key',
resave: false,
saveUninitialized: false
}));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// URL de conexión (puede ser 'mongodb://localhost:27017' para local)
// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(mongoUri, {
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

// Rutas de autenticación
app.get('/auth/google', passport.authenticate('google', {
scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
failureRedirect: '/'
}), (req, res) => {
res.redirect('/profile');
});

app.get('/profile', (req, res) => {
if (!req.isAuthenticated()) {
return res.redirect('/');
}
res.send(`Hola ${req.user.name}`);
});

app.get('/logout', (req, res) => {
req.logout();
res.redirect('/');
});

// Sirve los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/ruti-front/build')));

// Maneja todas las rutas no específicas y redirige al index.html del frontend
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '../frontend/ruti-front/public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
