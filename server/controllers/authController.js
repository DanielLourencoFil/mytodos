const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const logIn = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await pool.query('SELECT * FROM users 	WHERE email = $1', [
			email,
		]);
		if (user.rowCount === 0) {
			return res.status(404).json({ message: 'user is not registred' });
		}
		const success = await bcrypt.compare(
			password,
			user.rows[0].hashed_password
		);
		if (success) {
			const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
			res.status(200).json({ email: user.rows[0].email, token });
		} else {
			res.status(404).json({ message: 'login failed' });
		}
	} catch (error) {
		res.status(500).json(error);
		console.log('error login', error);
	}
};

const signUp = async (req, res) => {
	const { email, password } = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(password, salt);
	console.log(hashedPassword);
	try {
		const result = await pool.query(
			'INSERT INTO users(hashed_password, email) VALUES($1, $2)',
			[hashedPassword, email]
		);
		const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
		return res
			.status(200)
			.json({ email, token, message: 'user sucessfully registred' });
	} catch (error) {
		console.log(error);
		if (error.code === '23505') {
			res.status(400).json({ message: 'user is already registred' });
		} else {
			res.status(500).json({ error });
		}
	}
};

module.exports = { logIn, signUp };
