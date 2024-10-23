const express = require('express');
const router = express.Router();

const Patient = require("../models/patients.model");
const { verifyToken } = require('../middleware/authJwt');
const { PROFILE_UPDATE_SUCCESSFUL } = require('../constants/constants');
const { updatePatient, findPatientByUserId } = require('../services/patient.service');

router.post('/editProfile', verifyToken, async (req, res) => {
    try {
        const { name, dob, bloodType, height, weight, allergies, userId } = req.body;
        const patientDetails = { name: name, DOB: dob, bloodType: bloodType, height: height, weight: weight, allergies: allergies }

        updatePatient(userId, patientDetails)

        res.status(200).send({ message: PROFILE_UPDATE_SUCCESSFUL });
    } catch (err) {
        res.status(400).send({ message: err?.message });
    }
});

router.get('/appointment/:id', verifyToken, async (req, res) => {
    try {
        let appointments = await findUpcomingAppointments(req.params.id)
        res.status(200).send({ appointments: appointments });
    } catch (err) {
        res.status(400).send({ message: err?.message });
    }
})

router.get('/reminders/:id', verifyToken, async (req, res) => {
    try {
        let patientDetails = await findPatientByUserId(req.params.id)
        res.status(200).send({ reminders: patientDetails.healthReminders });
    } catch (err) {
        res.status(400).send({ message: err?.message });
    }
})