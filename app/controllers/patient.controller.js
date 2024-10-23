const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const { updatePatient, findPatientByUserId, findPatientById } = require('../services/patient.service');
const { PROFILE_UPDATE_SUCCESSFULLY } = require('../constants/constants');
const { findUpcomingAppointments } = require('../services/appointment.service');

// Edit Patient profile
router.post('/editProfile', verifyToken, async (req, res) => {
	try {
		const { name, dob, bloodType, height, weight, allergies, userId } = req.body;
		const patientDetails = {
			name: name,
			DOB: dob,
			bloodType: bloodType,
			height: height,
			weight: weight,
			allergies: allergies
		};

		updatePatient(userId, patientDetails);

		res.status(200).send({ message: PROFILE_UPDATE_SUCCESSFULLY });
	} catch (err) {
		res.status(400).send({ message: err?.message });
	}
});

// Get appointment details
router.get('/appointment/:id', verifyToken, async (req, res) => {
	try {
		let appointments = await findUpcomingAppointments(req.params.id);
		res.status(200).send({ appointments: appointments });
	} catch (err) {
		res.status(400).send({ message: err?.message });
	}
});

// Get reminders for patient
router.get('/reminders/:id', verifyToken, async (req, res) => {
	try {
		const patientDetails = await findPatientByUserId(req.params.id);
		res.status(200).send({ reminders: patientDetails.healthReminders });
	} catch (err) {
		res.status(400).send({ message: err?.message });
	}
});

// Get patient details
router.get('/getPatientDetails/:id', verifyToken, async (req, res) => {
	try {
		const patientDetails = await findPatientById(req.params.id);
		res.status(200).send({ details: patientDetails });
	} catch (err) {
		res.status(400).send({ message: err?.message });
	}
});

module.exports = router;
