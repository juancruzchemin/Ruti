// Función para registrar al usuario
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            email,
            password
        });

        // Guardar el nuevo usuario
        await newUser.save();

        // Generar un token para el usuario recién registrado (opcional)
        const token = jwt.sign({ userId: newUser._id }, 'tu_secreto', { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al registrar al usuario' });
    }
};