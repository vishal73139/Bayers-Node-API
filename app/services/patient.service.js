const Patient = require('../models/patients.model');
const User = require('../models/users.model');

const findPatientByUserId = async userId => {
	return await Patient.findOne({ userId: userId });
};

const savePatient = async patient => {
	return await Patient.create(patient);
};

module.exports = {
	findPatientByUserId,
	savePatient
};
