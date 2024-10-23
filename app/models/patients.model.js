const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    bloodType: {
        type: String,
    },
    height: {
        type: String,
    },
    weight: {
        type: String,
    },
    allergies: {
        type: [String]
    },
    healthReminders: {
        type: [String]
    },
    lastLogin: {
        type: Date
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date
    },
    DOB: {
        type: Date
    },
});

module.exports = mongoose.model('patients', PatientSchema);