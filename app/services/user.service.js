const User = require('../models/users.model');

const findUser = async email => {
	return await User.findOne({ email: email });
};

const findUserById = async id => {
	return await User.findById(id);
};

const saveUser = async user => {
	return await User.create(user);
};

module.exports = {
	findUser,
	saveUser,
	findUserById
};
