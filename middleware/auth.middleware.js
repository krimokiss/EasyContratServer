// Importer la bibliothèque jsonwebtoken
const jwt = require  ("jsonwebtoken");
// Charger la clé secrète depuis les variables d'environnement
const SECRET = `${process.env.SECRET}`
/**
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
 function verifyToken(req, res, next){
        // Récupérer le token d'autorisation depuis les en-têtes de la requête
    let token = req.headers["authorization"];
// Si aucun token n'est présent, retourner une erreur 403 (Forbidden)
    if (!token) {
        return res.status(403).send("Forbidden");
    }
 // Extraire le token JWT depuis le champ d'autorisation
    token = token.split(" ")[1]
 // Essayer de vérifier et décoder le token JWT
    try {
        const decoded = jwt.verify(token, SECRET);
         // Ajouter les informations décodées à l'objet req pour utilisation ultérieure
        req.salarie = decoded;
        req.entreprise = decoded;
    } catch (err) {
                // Si une erreur se produit, retourner une erreur 401 (Unauthorized)
        return res.status(401).send("Unauthorized");
    }
    return next();
}
// Exporter la fonction verifyToken pour l'utiliser comme middleware
module.exports = verifyToken