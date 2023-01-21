const pool = require("../../db");
const express = require('express');
const contratRouter = express.Router();


exports.getAllContrat = async (req,res) => {

try {
    const allUsers = await pool.query("SELECT * FROM contrat");
    res.json(allUsers.rows)
} catch (err) {
    console.error(err.message);
}
};

exports.getContratEnCours = async (req,res) => {

    try {
        const allUsers = await pool.query("SELECT * FROM salarie INNER JOIN contrat ON contrat.fki_salarie = salarie.salarie_id WHERE date_fin>date(now()) OR type_contrat='CDI'");
        res.json(allUsers.rows)
    } catch (err) {
        console.error(err.message);
    }
    };

exports.getAllContratByEntreprise = async (req,res) => {

    try {
        const allUsers = await pool.query("SELECT * FROM entreprise INNER JOIN contrat on entreprise.entreprise_id = contrat.fki_entreprise");
        res.json(allUsers.rows)
    } catch (err) {
        console.error(err.message);
    }
    };

    exports.getAllContratBySalarie = async (req,res) => {

        try {
            const allUsers = await pool.query("SELECT * FROM salarie INNER JOIN contrat on salarie.salarie_id = contrat.fki_salarie");
            res.json(allUsers.rows)
        } catch (err) {
            console.error(err.message);
        }
        };

exports.getSingleContrat = async (req,res) => {

    try {
        const { id } = req.params;
        const User = await pool.query("SELECT * FROM contrat WHERE contrat_id =$1", [
            id
        ]);
        res.json(User.rows[0])
        console.warn('blablablabl',User.rows);
    } catch (err) {
        console.error(err.message);
    }
    };

exports.postContrat = async (req,res) => {

    try {
        console.log(req.body);
        const {  
        fki_entreprise,
        fki_salarie,     
        type_contrat,
        is_fulltime,
        date_debut,
        date_fin,
        periode_essai,
        motif,
        fonction,
        statut,
    remuneration,
    validation } = req.body;
        const newContrat = await pool.query (
            "INSERT INTO contrat (fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut,remuneration,validation) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
            [fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut,remuneration,validation]
        );
        res.json(newContrat);
    } catch (err) {
        console.error(err.message);
    }
};

exports.deleteContrat = async (req,res) => {
    try {
        const { id } = req.params;
        const deleteContrat = await pool.query (
            "DELETE FROM contrat WHERE contrat_id = $1", [
                id
            ]
        );
        res.json("Contrat was deleted!")
    } catch (err) {
        console.log(err.message);
    }
};

exports.updateContrat = async (req,res) => {
    try {
        const { id } = req.params;
        let user = await pool.query (
            "SELECT * FROM contrat WHERE contrat_id=$1", [id]
        )
       
        if(user.rowCount === 0){
            console.log('bjsdhbshdj', user);
            res.status(400).json({
                status: "Bad requestfdgfdgdf"
              });
        }
        user = user.rows[0]
        console.log('update contrat',user.rows[0]);

        for (const key in req.body.formulaire) {
            user[key] = req.body.formulaire[key] || user[key];
            // console.log(req.body[key]);
        }
        const { fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut,remuneration,validation } = user
        const updateContrat = await pool.query (
            "UPDATE contrat SET fki_entreprise = $2,fki_salarie = $3,type_contrat = $4,is_fulltime = $5,date_debut = $6,date_fin = $7,periode_essai = $8,motif = $9,fonction = $10,statut = $11,remuneration = $12,validation = $13 WHERE contrat_id = $1", [
                id,fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut,remuneration,validation
            ]
        );
        res.status(200).json("Contrat was updated!")
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message)
    }
};