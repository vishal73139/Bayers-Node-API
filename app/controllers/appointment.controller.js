const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const { createAppointment } = require('../services/appointment.service');
const { APPOINTMENT_SUCCESSFULLY } = require('../constants/constants');

// Create Appointment for the patient
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot, reasonForVisit, notes, location, appointmentType } = req.body;
        const appointmentDetails = {
            patientId,
            doctorId,
            date,
            timeSlot,
            reasonForVisit,
            notes,
            location,
            appointmentType
        }

        await createAppointment(appointmentDetails)

        res.status(200).send({ message: APPOINTMENT_SUCCESSFULLY });
    } catch (err) {
        res.status(400).send({ message: err?.message });
    }
});

module.exports = router;