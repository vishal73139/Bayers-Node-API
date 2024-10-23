const express = require('express');
const { findUser, saveUser } = require('../services/user.service');
var bcrypt = require('bcryptjs');
const {
	INVALID_NAME_ERROR,
	INVALID_EMAIL,
	PASSWORD_ERROR,
	USER_ALERADY_ERROR,
	UNABLE_TO_REGISTER_ERROR,
	DOCTOR_ADD_SUCCESSFULLY
} = require('../constants/constants');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/doctors.model');
const { saveDoctor, getAllDoctorsList } = require('../services/doctor.service');
const { verifyToken } = require('../middleware/authJwt');
/*
 **
 ** BAYERS DOCTOR REGISTER
 ** @param {req, res}
 ** @return Sucess Message
 **
 */

router.post(
	'/add-doctor',
	[
		body('name', INVALID_NAME_ERROR).notEmpty(),
		body('email', INVALID_EMAIL).isEmail(),
		body('password', PASSWORD_ERROR).isLength({ min: 8 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { name, email, password, dob, specialties } = req.body;

			// Check if the doctor (user) already exists by email
			let user = await findUser(email);

			if (user) {
				return res.status(400).json({ error: USER_ALERADY_ERROR });
			}

			// Hash the password
			const hashedPassword = bcrypt.hashSync(password, 8);

			// Create a new user (assuming your user model is referenced in the doctor model)

			await saveUser({
				name,
				email,
				password: hashedPassword,
				role: 'DOCTOR' // Assuming 'doctor' is a valid user type
			})
				.then(doctorData => {
					doctorData._id &&
						saveDoctor({
							userId: doctorData._id,
							DOB: dob,
							SpecialtyIn: specialties
						});
				})
				.catch(err => {
					return res.status(400).json({ message: UNABLE_TO_REGISTER_ERROR });
				});

			res.status(201).json({ message: DOCTOR_ADD_SUCCESSFULLY });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: UNABLE_TO_REGISTER_ERROR });
		}
	}
);

/*
 **
 ** BAYERS DOCTOR REGISTER
 ** @param {res}
 ** @return Doctor List
 **
 */

router.get('/doctor-list', [verifyToken], async (req, res) => {
	try {
		const allDoctors = await getAllDoctorsList();
		res.status(200).json({ doctors: allDoctors });
	} catch (error) {
		console.error('Error deleting doctor:', error.message);
		res.status(500).json({ error: 'Failed to delete doctor', message: error.message });
	}
});

/*
 **
 ** GET DOCTOR BY ID
 ** @param {res}
 ** @return
 **
 */
router.get('/doctors/:id', [verifyToken], async (req, res) => {
	try {
		const doctor = await Doctor.findById(req.params.id).populate('user');

		if (!doctor) {
			return res.status(404).json({ error: 'Doctor not found' });
		}

		res.status(200).json(doctor);
	} catch (error) {
		console.error('Error fetching doctor:', error.message);
		res.status(500).json({ error: 'Failed to fetch doctor', message: error.message });
	}
});

/*
 **
 ** UPDATE DOCTOR BY ID
 ** @param {res}
 ** @return Updated Data
 **
 */
router.put('/doctors/:id', [verifyToken], async (req, res) => {
	try {
		const { DOB, availableTimeSlot, SpecialtyIn } = req.body;

		// Update the doctor
		const updatedDoctor = await Doctor.findByIdAndUpdate(
			req.params.id,
			{ DOB, availableTimeSlot, SpecialtyIn },
			{ new: true } // Return the updated document
		);

		if (!updatedDoctor) {
			return res.status(404).json({ error: 'Doctor not found' });
		}

		res.status(200).json(updatedDoctor);
	} catch (error) {
		console.error('Error updating doctor:', error.message);
		res.status(500).json({ error: 'Failed to update doctor', message: error.message });
	}
});

/*
 **
 ** GET DOCTOR BY SPECIALITY
 ** @param {res}
 ** @return specialty
 **
 */
router.get('/doctors/specialty/:specialty', [verifyToken], async (req, res) => {
	try {
		const specialty = req.params.specialty;
		const doctors = await Doctor.find({ SpecialtyIn: specialty });

		if (doctors.length === 0) {
			return res.status(404).json({ error: 'No doctors found for the given specialty' });
		}

		res.status(200).json(doctors);
	} catch (error) {
		console.error('Error fetching doctors by specialty:', error.message);
		res.status(500).json({ error: 'Failed to fetch doctors by specialty', message: error.message });
	}
});

/*
 **
 ** GET TIME SLOT FOR A DOCTOR
 ** @param {res}
 ** @return Time slots
 **
 */
router.get('/doctors/:id/available-slots', [verifyToken], async (req, res) => {
	try {
		const doctor = await Doctor.findById(req.params.id);

		if (!doctor) {
			return res.status(404).json({ error: 'Doctor not found' });
		}

		const availableSlots = doctor.availableTimeSlot || [];
		res.status(200).json({ availableSlots });
	} catch (error) {
		console.error('Error fetching available slots:', error.message);
		res.status(500).json({ error: 'Failed to fetch available slots', message: error.message });
	}
});

module.exports = router;
