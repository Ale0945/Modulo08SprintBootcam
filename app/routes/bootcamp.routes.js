const express = require('express')
const { Router } = express
const router = Router()

const bootcampController = require('./../controllers/bootcamp.controller')

const validations = require('./../middleware/index')

router.post('/bootcamp', validations.verifyToken, async(request, response) => {
    try {
        if (!request.body.title || !request.body.cue || !request.body.description) {
            return response.status(400).json({ message: 'Se requiere ingresar todos los campos' })
        }

        const bootcamp = await bootcampController.createBootcamp(request.body)

        return response.json(bootcamp)

    } catch (error) {
        return response.status(500).json(error)
    }
})

router.post('/bootcamp/addUser', validations.verifyToken, async(request, response) => {
    try {

        const userId = parseInt(request.userId);
        const bootcampId = parseInt(request.body.bootcampId);

        const added = await bootcampController.addUser(bootcampId, userId);

        if (!added) {
            return response.status(500).json({ message: 'Error al agregar usuario al bootcamp' });
        }

        return response.json({ message: 'Usuario agregado exitosamente al bootcamp' });
    } catch (error) {
        return response.status(500).json(error);
    }
});

router.get('/bootcamp/:id', validations.verifyToken, async(request, response) => {
    try {
        const bootcamp = await bootcampController.findById(request.params.id);

        if (!bootcamp) {
            return response.status(404).json({ message: 'Bootcamp no encontrado' });
        }

        return response.json(bootcamp);
    } catch (error) {
        return response.status(500).json(error);
    }
});

router.get('/bootcamp', async(request, response) => {
    try {
        const bootcamps = await bootcampController.findAll();

        return response.json(bootcamps);
    } catch (error) {
        return response.status(500).json(error);
    }
});

module.exports = router;