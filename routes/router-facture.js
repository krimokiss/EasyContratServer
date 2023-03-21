const express = require('express');
const myRouter = express.Router();
const facture = require('../controllers/facture/crud-facture');
const verifyToken = require('../middleware/auth.middleware')


myRouter.use(verifyToken)

myRouter.get('/allfacture', facture.getAllFacture)
myRouter.get('/facture/:id', facture.getSingleFacture)
myRouter.get('/facturebyent', facture.getAllFactureByEntreprise)
myRouter.post('/facture', facture.postFacture )
myRouter.delete('/delete/:id', facture.deleteFacture)
myRouter.put('/update/:id', facture.updateFacture)

module.exports = myRouter