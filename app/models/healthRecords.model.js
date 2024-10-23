const mongoose = require("mongoose")

const HealthRecord = new mongoose.Schema({
    appointmentType: {
        type: String
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    date: {
        type: Date
    },
    timeSlot: {
        type: Date
    },
    reasonForVisit: {
        type: String
    },
    notes: {
        type: String
    },
    location: {
        type: String
    },
    createdAt: {
        type: Date
    },
});

module.exports = mongoose.model('healthRecords', HealthRecord);