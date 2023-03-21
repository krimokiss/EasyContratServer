const express = require('express');
const myRouter = express.Router();
const salarie = require('../controllers/salarie/crud-salarie');
const verifyToken = require('../middleware/auth.middleware')
const rateLimit = require("express-rate-limit");

// Configuration de la limite de tentatives de connexion
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limite de 5 tentatives de connexion par fenêtre
    handler: (req, res, next) => {
        res.status(429).json({
          message: "Vous avez dépassé la limite de tentatives de connexion. Veuillez réessayer dans 15 minutes."
        });
      },
  });

  

myRouter.post('/login',loginLimiter, salarie.loginSalarie)
myRouter.post('/register', salarie.postUser )

myRouter.use(verifyToken)

myRouter.get('/allUsers', salarie.getAllUsers)
myRouter.get('/user/:id', salarie.getSingleUser)
myRouter.delete('/delete/:id', salarie.deleteUser)
myRouter.put('/update/:id', salarie.updateUser)
myRouter.get('/profil', salarie.getProfil)


module.exports = myRouter