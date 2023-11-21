const app = require('express');
const router = app.Router();

const { logIn, signUp } = require('./controllers/authController');
const {
	todosGetAll,
	todosUpdateOne,
	todosCreateOne,
	todosDeleteOne,
	test,
} = require('./controllers/todosController');

// ROUTES for AUTHENTICATION
router.post('/login', logIn);
router.post('/signup', signUp);

// ROUTES for todos CRUD
router.get('/todos/ping', test);
router.get('/todos/:userEmail', todosGetAll);
router.put('/todos/:id', todosUpdateOne);
router.post('/todos', todosCreateOne);
router.delete('/todos/:id', todosDeleteOne);

module.exports = router;
