const express = require("express");
const app = express();
const cors = require("cors");

//import api routers
const salarieRoute = require('../server/routes/router-salarie');
const entrepriseRoute = require('../server/routes/router-entreprise');
const contratRoute = require('../server/routes/router-contrat')

// Middleware
app.use(cors());
app.use(express.json()); //req.body

//redirect to routes
app.use("/api/salarie", salarieRoute);
app.use("/api/entreprise", entrepriseRoute);
app.use("/api/contrat", contratRoute);



app.listen(5000, () => [
    console.log("server has started on port 5000")
]);