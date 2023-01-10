const express = require('express');
const myRouter = express.Router();
const contrat = require('../controllers/contrat/crud-contrat');
const verifyToken = require('../middleware/auth.middleware')


myRouter.use(verifyToken)

myRouter.get('/allcontrat', contrat.getAllContrat)
myRouter.get('/mescontrats', contrat.getContratEnCours)
myRouter.get('/contrat/:id', contrat.getSingleContrat)
myRouter.get('/contratbyent', contrat.getAllContratByEntreprise)
myRouter.get('/contratbysalarie', contrat.getAllContratBySalarie)
myRouter.post('/contrat', contrat.postContrat )
myRouter.delete('/delete/:id', contrat.deleteContrat)
myRouter.put('/update/:id', contrat.updateContrat)

module.exports = myRouter