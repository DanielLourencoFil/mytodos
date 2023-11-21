const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

const todosGetAll = async (req, res) => {
	const { userEmail } = req.params;
	try {
		const todos = await pool.query(
			'SELECT * FROM todos WHERE user_email = $1 ORDER BY createdat DESC',
			[userEmail]
		);
		res.status(200).json(todos.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const todosUpdateOne = async (req, res) => {
	const id = req.params.id;
	const { title, progress, description } = req.body;
	try {
		const result = await pool.query(
			'UPDATE todos SET title = $1, progress = $2, description = $3 WHERE id = $4',
			[title, progress, description, id]
		);
		// Check the number of rows affected to determine if the update was successful
		if (result.rowCount === 1) {
			res.status(200).json({ message: 'Update successful' });
		} else {
			res.status(404).json({ message: 'Record not found' });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const todosCreateOne = async (req, res) => {
	const { title, progress, user_email, description } = req.body;
	console.log(user_email, title);
	const id = uuidv4();
	const createdat = new Date();
	try {
		const result = await pool.query(
			'INSERT INTO todos (id, user_email, title, progress, createdat, description) VALUES ($1, $2, $3, $4, $5, $6)',
			[id, user_email, title, progress, createdat, description]
		);

		if (result.rowCount === 1) {
			res.status(201).json({ message: 'Todo added successfully' });
		} else {
			res.status(500).json({ message: 'Failed to add todo' });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const todosDeleteOne = async (req, res) => {
	const id = req.params.id;
	console.log(id);
	try {
		const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);

		if (result.rowCount === 1) {
			res.status(200).json({ message: 'Update successful' });
		} else {
			res.status(404).json({ message: 'Record not found' });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const test = async (req, res) => {
	const result = await pool.query('SELECT now()');
	return res.send(result.rows[0]);
	// return res.send('hello');
};
module.exports = {
	todosGetAll,
	todosUpdateOne,
	todosCreateOne,
	todosDeleteOne,
	test,
};
