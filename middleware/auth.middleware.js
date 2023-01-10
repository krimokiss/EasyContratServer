const jwt = require  ("jsonwebtoken");
const SECRET = process.env.SECRET

/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
 function verifyToken(req, res, next){
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send("Forbidden");
    }

    console.log(req.headers)
    token = token.split(" ")[1]

    try {
        const decoded = jwt.verify(token, SECRET);
        req.salarie = decoded;
        req.entreprise = decoded;
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    return next();
}

module.exports = verifyToken