const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
	connectionString: process.env.DB_HOST,
});

// console.log(process.env.DB_PASSWORD);
// const pool = new Pool({
// 	user: process.env.DB_USERNAME,
// 	password: process.env.DB_PASSWORD,
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	database: 'todoapp',
// });

// console.log(process.env.DB_PASSWORD);
module.exports = pool;
