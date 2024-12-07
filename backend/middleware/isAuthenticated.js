const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Autenticación fallida: No se proporcionó un token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usa el mismo secreto que usaste para firmar el token
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Autenticación fallida' });
  }
};

module.exports = authenticate;