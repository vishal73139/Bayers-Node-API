const Doctor = require('../models/doctors.model');
const User = require('../models/users.model');

const saveDoctor = async doctorData => {
	return await Doctor.create(doctorData);
};
const getAllDoctorsList = async () => {
	return await User.aggregate([
		{ $match: { role: 'DOCTOR' } },
		{
			$lookup: {
				from: 'doctors',
				localField: '_id',
				foreignField: 'userId',
				as: 'doctorData'
			}
		},
		{
			$project: {
				_id: 1,
				name: 1,
				email: 1,
				doctorData: 1
			}
		}
	]);
};

module.exports = {
	saveDoctor,
	getAllDoctorsList
};
