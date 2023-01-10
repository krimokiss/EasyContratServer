
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = require("../../config.js")
const pool = require("../../db");
const express = require('express');
const salarieRouter = express.Router();
const validator = require("validator");

const { isEmail } = validator

exports.getAllUsers = async (req, res) => {

    try {
        const allUsers = await pool.query("SELECT * FROM salarie");
        res.json(allUsers.rows)
    } catch (err) {
        console.error(err.message);
    }
};

exports.getSingleUser = async (req, res) => {

    try {
        const { id } = req.params;
        const User = await pool.query("SELECT * FROM salarie WHERE salarie_id =$1", [
            id
        ]);
        res.json(User.rows[0])
        console.log('tesetstetst', User.rows);
    } catch (err) {
        console.error(err.message);
    }
};

exports.postUser = async (req, res) => {


    //on verifie la validite de l'email
    const { email } = req.body
    if (!isEmail(email)) {
        console.log('erreur mail');
        return false;
    }

    // On verifie que l'email n'est pas deja utilisé
    let user = await pool.query('SELECT email FROM salarie WHERE email =$1', [
        email
    ]);
    if (user.rowCount != 0) {
        console.log('Email existe deja');
        res.status(409).json({ error: "Email is incorrect" })
        return false;
    } else {

        try {
            // console.log(req.body);
            const {
                civilite,
                nom,
                prenom,
                telephone,
                rue,
                cp,
                ville,
                email,
                nom_jeune_fille,
                num_ss,
                date_naissance,
                lieu_naissance,
                pays_naissance } = req.body;

            let { mdp } = req.body;
            let hashedPassword = await bcrypt.hash(mdp, 10);
            mdp = hashedPassword

            const newUser = await pool.query(
                "INSERT INTO salarie (civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,nom_jeune_fille,num_ss,date_naissance,lieu_naissance,pays_naissance) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
                [civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, nom_jeune_fille, num_ss, date_naissance, lieu_naissance, pays_naissance]
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

exports.loginSalarie = async (req, res) => {

    //validate mail
    //  const { email } = req.body
    //  if (!isEmail(email)) {
    //      console.log('erreur mail');
    //      return false;
    //  }
    //  check if the email is already used
    //  let user = await pool.query('SELECT email FROM salarie WHERE email =$1', [
    //      email
    //  ]);
    //  if (user) {console.log(email);
    //      console.log('test');
    //      return false;

    //  }

    try {
        const { email, mdp } = req.body;
        const login = await pool.query("SELECT * FROM salarie WHERE email=$1", [email]);
        //** Je verifie le format de l'email via validator et isEmail */

        if (!isEmail(email)) {
            console.log("invalid email");
            res.status(402).json({ "email": email, "message": "invalid email" })
            return false
        }
        if (login.rows.length === 0) return res.status(401).json({ error: "Email is incorrect" });

        // else if (login.rows.length !== 0) res.status(200).json({ message: "You are welcome" });

        // //? ------------je vérifie son password hashed et son password en claire ------------- ** /

        const clearPassword = await login.rows[0].mdp
        const validPassword = await bcrypt.compare(mdp, clearPassword);
        if (!validPassword) return res.status(401).json({ error: "wrong password" })

        const user = { email: login.rows[0].email, utilisateur_id: login.rows[0].utilisateur_id, role: login.rows[0].role, mdp: login.rows[0].mdp, salarie_id: login.rows[0].salarie_id }

        // TODO ------------- le JWT --------------------- //

        let id = login.salarie_id
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
        res.status(200).json({ "token": token, "datas": user, message: "Loged successfully" })

    } catch (err) {
        console.error(err.message);

        res.status(400).json({ err: err })

    }
};



exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query(
            "DELETE FROM salarie WHERE salarie_id = $1", [
            id
        ]
        );
        res.json("User was deleted!")
    } catch (err) {
        console.log(err.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let user = await pool.query(
            "SELECT * FROM salarie WHERE salarie_id=$1", [id]
        )

        if (user.rowCount === 0) {
            res.status(400).json({
                status: "Bad request"
            });
        }
        user = user.rows[0]



        for (const key in req.body.formulaire) {
            user[key] = req.body.formulaire[key] || user[key];
            // console.log(req.body.formulaire[key]);
        }


        const { civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, nom_jeune_fille, num_ss, date_naissance, lieu_naissance, pays_naissance } = user

        // let { mdp } = req.body;
        // let hashedPassword = await bcrypt.hash(mdp, 10);
        // mdp = hashedPassword

        const updateUser = await pool.query(
            "UPDATE salarie SET civilite = $2,nom = $3,prenom = $4,telephone = $5,rue = $6,cp = $7,ville = $8,email = $9,mdp =$10,nom_jeune_fille = $11,num_ss = $12,date_naissance = $13,lieu_naissance = $14,pays_naissance = $15 WHERE salarie_id = $1", [
            id, civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, nom_jeune_fille, num_ss, date_naissance, lieu_naissance, pays_naissance
        ]

        );
        res.status(200).json("User was updated!")
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message)
    }
};

exports.getProfil = async (req, res) => {

    try {
        const id = req.salarie
        console.log(id);
        const Salarie = await pool.query(
            'SELECT * FROM salarie WHERE email=$1', [id.email]);
        // console.log('salarie from crud', Salarie.rows);
        res.json(Salarie.rows[0]);
        //  console.log('TESSSSST', Salarie.rows[0]);
    } catch (err) {
        console.error(err.message)
        res.status(400).send(err.message)
    }
}