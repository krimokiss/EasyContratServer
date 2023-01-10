const Pool = require("pg").Pool;
// require("dotenv").config()

// const pool = new Pool({
//     user: "postgres",
//     password: "boubou",
//     host: "localhost",
//     port: 5432,
//     database: "easycontrat"
// });



const pool = new Pool({
    user: 'krimo',
    password: 'NHmEY67R9P0BsQH8uotIjLm9zeYqvUvo',
    host: "dpg-ceuil56n6mpglqd2v0ng-a.frankfurt-postgres.render.com",
    port: 5432,
    database: "easycontrat",
    ssl:true
});



module.exports = pool;