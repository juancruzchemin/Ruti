// middleware/isAuthenticated.js (opcional si deseas un archivo separado)
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // El usuario está autenticado, continúa con la siguiente función
    }
    res.redirect('/'); // Redirige a la página de inicio si no está autenticado
  }
  
  module.exports = isAuthenticated;
  