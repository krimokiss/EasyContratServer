const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config()

//import api routers
const salarieRoute = require('./routes/router-salarie');
const entrepriseRoute = require('./routes/router-entreprise');
const contratRoute = require('./routes/router-contrat');
const factureRoute = require('./routes/router-facture')

// Middleware
app.use(cors());
app.use(express.json()); //req.body


//redirect to routes
app.use("/api/salarie", salarieRoute);
app.use("/api/entreprise", entrepriseRoute);
app.use("/api/contrat", contratRoute);
app.use("/api/facture", factureRoute)


app.listen(5000, () => [
    console.log("server has started on port 5000")
]);