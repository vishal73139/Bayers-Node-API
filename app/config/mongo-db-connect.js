const mongoDbConfig = require('./mongo-db-config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
const url = `mongodb+srv://${mongoDbConfig.USERNAME}:${mongoDbConfig.PASSWORD}@${mongoDbConfig.HOST}/${mongoDbConfig.DB}?authSource=admin`;
db.mongoose = mongoose;

var _db;

const connectMongoDatabase = callback => {
	db.mongoose
		.connect(url, {
			useNewUrlParser: true
		})
		.then((err, client) => {
			_db = client;
			console.log('MongoDB Connected.');
		})
		.catch(err => {
			console.error('Mongodb : Connection error', err);
			process.exit();
		});
};

const getMongoDbConnection = () => {
	console.log('getMongoDbConnection');
	return _db;
};

module.exports = {
	connectMongoDatabase: connectMongoDatabase(),
	getMongoDbConnection: getMongoDbConnection()
};
