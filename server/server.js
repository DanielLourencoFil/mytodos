const app = require('./app');
const PORT = 8000;
// const PORT = process.env.DB_PORT || 8000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
