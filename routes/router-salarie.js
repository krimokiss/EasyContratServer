const express = require('express');
const myRouter = express.Router();
const salarie = require('../controllers/salarie/crud-salarie');
const verifyToken = require('../middleware/auth.middleware')
const routeSalarie = express.Router()
const {loginSalarie}=require('../controllers/salarie/crud-salarie')

routeSalarie
.post('/login', loginSalarie)


// myRouter.post('/login', salarie.loginSalarie)
myRouter.post('/register', salarie.postUser )

myRouter.use(verifyToken)

myRouter.get('/allUsers', salarie.getAllUsers)
myRouter.get('/user/:id', salarie.getSingleUser)
myRouter.delete('/delete/:id', salarie.deleteUser)
myRouter.put('/update/:id', salarie.updateUser)
myRouter.get('/profil', salarie.getProfil)
// myRouter.put('/update', salarie.updateUser)



module.exports = myRouter
module.exports = routeSalarie