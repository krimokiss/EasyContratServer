const express = require('express');
const myRouter = express.Router();
const entreprise = require('../controllers/entreprise/crud-entreprise');
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


myRouter.post('/login', entreprise.loginEntreprise)
myRouter.post('/register', entreprise.postUserEntreprise )

myRouter.use(verifyToken)


myRouter.get('/allUsers', entreprise.getAllUsersEntreprise)
myRouter.get('/user/:id', entreprise.getSingleUserEntreprise)
myRouter.delete('/delete/:id', entreprise.deleteUserEntreprise)
myRouter.put('/update/:id', entreprise.updateUserEntreprise)
myRouter.get('/profil', entreprise.getProfilEntreprise)

module.exports = myRouter