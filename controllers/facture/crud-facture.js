const pool = require("../../db");
const express = require('express');
const contratRouter = express.Router();


exports.getAllFacture = async (req,res) => {

try {
    const allInvoices = await pool.query("SELECT * FROM facture");
    res.json(allInvoices.rows)
} catch (err) {
    console.error(err.message);
}
};

exports.getAllFactureByEntreprise = async (req,res) => {

    try {
        const allInvoices= await pool.query("SELECT * FROM entreprise INNER JOIN facture on entreprise.entreprise_id = facture.fki_entreprise");
        res.json(allInvoices.rows)
    } catch (err) {
        console.error(err.message);
    }
    };

exports.getSingleFacture = async (req,res) => {

    try {
        const { id } = req.params;
        const Invoice = await pool.query("SELECT * FROM facture WHERE facture_id =$1", [
            id
        ]);
        res.json(Invoice.rows[0])
        // console.warn(User.rows);
    } catch (err) {
        console.error(err.message);
    }
    };

exports.postFacture = async (req,res) => {

    try {
        console.log(req.body);
        const {  
        fki_entreprise,
        nom_client,     
        adresse_client,
        cp_client,
        ville_client,
        date_facture,
        description,
        tarif,
        quantite,
        tva,
        paiement,
        payer } = req.body;
        const newFacture = await pool.query (
            "INSERT INTO facture (fki_entreprise,nom_client,adresse_client,cp_client,ville_client,date_facture,description,tarif,quantite,tva,paiement,payer) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
            [fki_entreprise,nom_client,adresse_client,cp_client,ville_client,date_facture,description,tarif,quantite,tva,paiement,payer]
        );
        res.json(newFacture);
    } catch (err) {
        console.error(err.message);
    }
};

exports.deleteFacture = async (req,res) => {
    try {
        const { id } = req.params;
        const deleteFacture = await pool.query (
            "DELETE FROM facture WHERE facture_id = $1", [
                id
            ]
        );
        res.json("Facture correctement supprimé!")
    } catch (err) {
        console.log(err.message);
    }
};

exports.updateFacture = async (req,res) => {
    try {
        const { id } = req.params;
        let user = await pool.query (
            "SELECT * FROM facture WHERE facture_id=$1", [id]
            )
       
        if(user.rowCount === 0){
            res.status(400).json({
                status: "Bad request"
              });
        }
        user = user.rows[0]
      
        for (const key in req.body.formulaire) {
            user[key] = req.body.formulaire[key] || user[key];
        }
        const { fki_entreprise,nom_client,adresse_client,cp_client,ville_client,date_facture,description,tarif,quantite,tva,paiement,payer } = user
        const updateFacture = await pool.query (
            "UPDATE facture SET fki_entreprise = $2,nom_client = $3,adresse_client = $4,cp_client = $5,ville_client = $6,date_facture = $7,description = $8,tarif = $9,quantite = $10,tva = $11,paiement = $12,payer = $13 WHERE contrat_id = $1", [
                id,fki_entreprise,nom_client,adresse_client,cp_client,ville_client,date_facture,description,tarif,quantite,tva,paiement,payer
            ]
        );
        res.status(200).json("La facture à été mise a jour!")
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message)
    }
};