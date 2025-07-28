const { response } = require("express");
const User = require("../models/users.models");

// Crear un usuario
module.exports.createUser = async (req, res) => {
    const { name, email, pass, role, estado, fechaNacimiento, bio, username } = req.body;

    // Validar datos incompletos (bio puede ser opcional)
    if (!name || !email || !pass || !role || !estado || !fechaNacimiento || !username) {
        console.log(req.body);
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Correo ya registrado" });
        }

        // Crear usuario
        const newUser = await User.create({
            name,
            email,
            pass,
            role,
            estado,
            fechaNacimiento,
            bio,
            username
        });

        res.status(201).json({
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email,
            pass: newUser.pass,
            role: newUser.role,
            estado: newUser.estado,
            fechaNacimiento: newUser.fechaNacimiento ? newUser.fechaNacimiento.toISOString().split('T')[0] : "",
            bio: newUser.bio,
            username: newUser.username
        });
    } catch (err) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
};

// Obtener todos los usuarios
module.exports.getAllUsers = async (_, res) => {
    try {
        const users = await User.findAll();
        console.log(users.length)
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener un usuario por id 
module.exports.getUserXId = async (req, res) => {
    // Primero valido si el id se encuentra en la lista (podria hacerse midiendo la lista de objetos users.length?)
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch {
        res.status(500).json({ message: 'No se pudo obtener el usuario con esa id' });

    }
}


// actualizar (parcialmente: estado) un usuario por id
module.exports.updUserEstado = async (req, res) => {
    try {
        // Se actualiza el usuario
        const [updatedRowCount] = await User.update(req.body, {
            where: { id: req.params.id }
        })
        console.log(updatedRowCount);

        // Se verifica si se ha actualizado algun registro
        if (updatedRowCount) {
            // Recupera la información actualizada del usuario
            console.log("se cambio");

            const updatedUser = await User.findOne({ where: { id: req.params.id } });
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'No se pudo actualizar el usuario', err: err });
    }

}

// actualizar (parcialmente: info perfil usuario) un usuario por id
module.exports.updUserPerfil = async (req, res) => {
    try {
        // Se actualiza el usuario
        const [updatedRowCount] = await User.update(req.body, {
            where: { id: req.params.id }
        })
        console.log(updatedRowCount);

        // Se verifica si se ha actualizado algun registro
        if (updatedRowCount) {
            // Recupera la información actualizada del usuario
            console.log("se cambio");

            const updatedUser = await User.findOne({ where: { id: req.params.id } });
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'No se pudo actualizar el usuario', err: err });
    }

}

// Eliminar usuario por ID
module.exports.delUserXId = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        await User.destroy({ where: { id: req.params.id } });
        res.json(user);

    } catch (err) {
        res.status(500).json({ message: "No se pudo eliminar el usuario" });

    }
}


// Función para realizar el login del usuario
const loginUsuario = async (email, password) => {
    try {
        // Realiza la solicitud GET al endpoint de login
        const response = await axios.get(`http://localhost:8000/api/v1/auth/login`, {
            params: {
                email,
                password,
            }
        });

        if (response.status === 200) {
            // Si el login es exitoso, guarda los datos del usuario en el localStorage
            const usuario = response.data[0];  // Asumiendo que la respuesta es un arreglo con un único objeto
            localStorage.setItem("usuario", JSON.stringify(usuario)); // Guarda los datos en el localStorage

            // Devuelve el usuario para usar en otros componentes
            return usuario;
        }
    } catch (error) {
        if (error.response) {
            // Si la respuesta del servidor contiene un error
            const errorMessage = error.response.data.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            // Si no hay respuesta, es un error en la conexión
            throw new Error('Error al intentar conectar con el servidor');
        }
    }
};