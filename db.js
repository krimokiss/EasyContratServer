const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "boubou",
//     host: "localhost",
//     port: 5432,
//     database: "easycontrat"
// });



const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    ssl:process.env.SSL
});



module.exports = pool;