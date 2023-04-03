const Pool = require("pg").Pool;
// require("dotenv").config()

const pool = new Pool({
    user: "postgres",
    password: "boubou",
    host: "localhost",
    port: 5432,
    database: "easycontrat"
});



// const pool = new Pool({
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     host: "dpg-ceuil56n6mpglqd2v0ng-a.frankfurt-postgres.render.com",
//     port: 5432,
//     database: process.env.DATABASE,
//     ssl:true
// });



module.exports = pool;