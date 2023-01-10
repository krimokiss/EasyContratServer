const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "boubou",
    host: "localhost",
    port: 5432,
    database: "easycontrat"
});

module.exports = pool;