const express = require('express')
const { Router } = express
const router = Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/auth.config');

const userController = require('../controllers/user.controller')
const validations = require('../middleware/index')

router.post('/signup', async (req, res) => {

    const existsEmail = await validations.verifySingUp(req.body.email);
    
    if (existsEmail) {
        return res.status(400).json({ message: 'El email ingresado ya esta en uso' });
    }

    try {
        await userController.createUser(req, res);
    }catch(error) {
        return res.status(500).json(error);
    }
});


router.post('/signin', async (req, res) => {

    const emailExists = await validations.verifySingUp(req.body.email);

    if (emailExists) {
        const user = await userController.findUserById(emailExists.id);

        const passwordCompare = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordCompare) {
            return res.status(404).json({ message: "Clave incorrecta" });
        }

        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    
        const loginUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken: token
        }
    
        return res.json(loginUser);

    } else {
        return res.status(404).json({ message: "Usuario no registrado" });
    }

})

router.get('/user/:id', validations.verifyToken, async (req, res) => {
    try {
        if (parseInt(req.params.id) !== parseInt(req.userId)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const user = await userController.findUserById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json(user);

    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/user', validations.verifyToken, async (req, res) => {
    try {
        const users = await userController.findAll();

        return res.json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
})

router.put('/user/:id', validations.verifyToken, async (req, res) => {
    try {

        if (parseInt(req.params.id) !== parseInt(req.userId)) {
            return res.status(403).json({ message: 'No se puede modificar información de otros usuarios' });
        }

        if (!req.body.firstName || !req.body.lastName) {
            return res.status(400).json({ message: 'Debe ingresar un nombre y/o apellido para modificar' });
        }

        const updatedUser = await userController.updateUserById(req.params.id, req.body.firstName, req.body.lastName);

        if (!updatedUser) {
            return res.status(404).json({ message: 'No se actualizó el usuario' });
        }

        const newUserInfo = await userController.findUserById(updatedUser.id);

        return res.json(newUserInfo);

    } catch (error) {
        return res.status(500).json(error);
    }
})

router.delete('/user/:id', validations.verifyToken, async (req, res) => {
    try {

        if (parseInt(req.params.id) !== parseInt(req.userId)) {
            return res.status(403).json({ message: 'No puede borrar otros usuarios' });
        }

        const deletedUser = await userController.deleteUserById(req.params.id)

        if (!deletedUser) {
            return res.status(404).json({ message: 'Hubo un error al borrar el usuario' });
        }

        return res.status(200).json({message: `Se ha borrado ${deletedUser} el usuario`});

    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router;