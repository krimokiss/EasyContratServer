const express = require('express');
const myRouter = express.Router();
const salarie = require('../controllers/salarie/crud-salarie');
const verifyToken = require('../middleware/auth.middleware')


myRouter.post('/login', salarie.loginSalarie)
myRouter.post('/register', salarie.postUser )

myRouter.use(verifyToken)

myRouter.get('/allUsers', salarie.getAllUsers)
myRouter.get('/user/:id', salarie.getSingleUser)
myRouter.delete('/delete/:id', salarie.deleteUser)
myRouter.put('/update/:id', salarie.updateUser)
myRouter.get('/profil', salarie.getProfil)
// myRouter.put('/update', salarie.updateUser)



module.exports = myRouter