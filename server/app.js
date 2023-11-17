const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(express('json'));
app.use(bodyParser.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);
app.use('/api/v1', routes);

module.exports = app;
