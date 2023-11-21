const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(express('json'));
app.use(bodyParser.json());
// app.use(cors());
// app.use(
// 	cors({
// 		origin: ['http://localhost:5173', 'https://mytodos-h2k2.onrender.com'],
// 	})
// );
app.get('/', async (req, res) => {
	console.log('hello world');
	return res.send('hello wordl');
});
app.use('/api/v1', routes);

module.exports = app;
