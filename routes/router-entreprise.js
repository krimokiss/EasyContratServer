const express = require('express');
const myRouter = express.Router();
const entreprise = require('../controllers/entreprise/crud-entreprise');
const verifyToken = require('../middleware/auth.middleware')


myRouter.post('/login', entreprise.loginEntreprise)
myRouter.post('/register', entreprise.postUserEntreprise )

myRouter.use(verifyToken)


myRouter.get('/allUsers', entreprise.getAllUsersEntreprise)
myRouter.get('/user/:id', entreprise.getSingleUserEntreprise)
myRouter.delete('/delete/:id', entreprise.deleteUserEntreprise)
myRouter.put('/update/:id', entreprise.updateUserEntreprise)
myRouter.get('/profil', entreprise.getProfilEntreprise)

module.exports = myRouter