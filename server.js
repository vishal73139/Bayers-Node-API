const express = require('express');
const cors = require('cors');

/*
 ** Database Connection
 */
const mongoDbConnection = require('./app/config/mongo-db-connect');

/*
 ** Controllers
 ** @param {app}
 ** @return {app}
 */
const app = express();
const authController = require('./app/controllers/auth.controller');

var corsOptions = {
	origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/*
 ** Routes
 ** @param {app}
 ** @return {app}
 */
app.use('/api/auth', authController);
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
