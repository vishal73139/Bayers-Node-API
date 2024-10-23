const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const { APPOINTMENT_SUCCESSFUL } = require('../constants/constants');
const { createAppointment } = require('../services/appointment.service');

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot, reasonForVisit, notes, location } = req.body;
        const appointmentDetails = {
            patientId,
            doctorId,
            date,
            timeSlot,
            reasonForVisit,
            notes,
            location
        }

        createAppointment(appointmentDetails)

        res.status(200).send({ message: APPOINTMENT_SUCCESSFUL });
    } catch (err) {
        res.status(400).send({ message: err?.message });
    }
});

module.exports = router;