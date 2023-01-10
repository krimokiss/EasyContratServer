const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = require("../../config.js")
const pool = require("../../db");
const express = require('express');
const salarieRouter = express.Router();
const validator = require("validator")

const { isEmail } = validator


exports.getAllUsersEntreprise = async (req,res) => {

try {
    const allUsers = await pool.query("SELECT * FROM entreprise");
    res.json(allUsers.rows)
} catch (err) {
    console.error(err.message);
}
};

exports.getSingleUserEntreprise = async (req,res) => {

    try {
        const { id } = req.params;
        const User = await pool.query("SELECT * FROM entreprise WHERE entreprise_id =$1", [
            id
        ]);
        res.json(User.rows[0])
    } catch (err) {
        console.error(err.message);
    }
    };

exports.postUserEntreprise = async (req,res) => {

     //validate mail
     const { email } = req.body
     if (!isEmail(email)) {
         console.log('erreur mail');
         return false;
     }

     let user = await pool.query('SELECT email FROM entreprise WHERE email =$1', [
        email
    ]);
    if (user.rowCount != 0) {
        // res.status(402).json({ error: "Email incorrect" })
        // res.status(400).send('EMAIL INCORRECT')
        res.status(409).json({
            status: "Email deja utilisé"
          })
        console.log('Email existe deja');
        return false;
    } else { 

    try {
        console.log(req.body);
        const {   
        civilite,
        nom,
        prenom,
        telephone,
        rue,
        cp,
        ville,
        email,
        siret,
        raison_sociale,
        code_ape } = req.body;

        let { mdp } = req.body;
        let hashedPassword = await bcrypt.hash(mdp, 10);
        mdp = hashedPassword

        const newUser = await pool.query (
            "INSERT INTO entreprise (civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,siret,raison_sociale,code_ape) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
            [civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,siret,raison_sociale,code_ape]
        );
 // creation du token
 let id = newUser.salarie_id
 const token = jwt.sign(
     {
         id, email, mdp
     },
     SECRET,
     {
         expiresIn: "720h",
     }
 )

 res.status(200).json({ newUser, token });
 console.log(token);
} catch (err) {
 console.error(err.message);
}
    }
};

exports.loginEntreprise = async (req, res) => {

 
    try {
        const { email, mdp } = req.body;
        const login = await pool.query("SELECT * FROM entreprise WHERE email=$1", [email]);
        //** Je verifie le format de l'email via validator et isEmail */

        if (!isEmail(email)) {
            console.log("invalid email");
            res.status(402).json({ "email": email, "message": "Email est invalide" })
            return false
        }
        if (login.rows.length === 0) return res.status(401).json({ error: "Email incorrect" });


        // //? ------------je vérifie son password hashed et son password en claire ------------- ** /

        const clearPassword = await login.rows[0].mdp
        const validPassword = await bcrypt.compare(mdp, clearPassword);
        if (!validPassword) return res.status(401).json({ error: "wrong password" })

        const user = { email: login.rows[0].email, utilisateur_id: login.rows[0].entreprise_id, role: login.rows[0].role, mdp: login.rows[0].mdp }

        // TODO ------------- le JWT --------------------- //

        let id = login.entreprise_id
        const token = jwt.sign(
            {
                id, email, mdp
            },
            SECRET,
            {
                expiresIn: "720h",
            }
        )
        // console.log({ "token": tokens });
        res.status(200).json({ "token": token, "datas": user, message: "Bienvenue" })

    } catch (err) {
        console.error(err.message);

        res.status(400).json({ err: err })

    }
};



exports.deleteUserEntreprise = async (req,res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query (
            "DELETE FROM entreprise WHERE entreprise_id = $1", [
                id
            ]
        );
        res.json("User was deleted!")
    } catch (err) {
        console.log(err.message);
    }
};

exports.updateUserEntreprise = async (req,res) => {

    
    try {
        const { id } = req.params;
        let user = await pool.query (
            "SELECT * FROM entreprise WHERE entreprise_id=$1", [id]
        )
       
        if(user.rowCount === 0){
            res.status(400).json({
                status: "Bad request"
              });
        }
        user = user.rows[0]

        for (const key in req.body.formulaire) {
            user[key] = req.body.formulaire[key] || user[key];
            // console.log(req.body[key]);
        }
        
        const { civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,siret,raison_sociale,code_ape } = user
        const updateUser = await pool.query (
            "UPDATE entreprise SET civilite = $2,nom = $3,prenom = $4,telephone = $5,rue = $6,cp = $7,ville = $8,email = $9,mdp =$10,siret = $11,raison_sociale = $12,code_ape = $13 WHERE entreprise_id = $1", [
                id,civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,siret,raison_sociale,code_ape
            ]
        );
        res.status(200).json("User was updated!")
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message)
    }
};


exports.getProfilEntreprise = async (req, res) => {

    try {
        const  id  = req.entreprise
        // console.log(id);
        const Entreprise = await pool.query(
            'SELECT * FROM entreprise WHERE email=$1', [id.email]);
            // console.log('Profil entreprise', Entreprise.rows);
        res.json(Entreprise.rows[0]);
     
    } catch (err) {
        console.error(err.message)
        res.status(400).send(err.message)
    }
}