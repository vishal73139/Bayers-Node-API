const mongoose = require("mongoose")

const HealthRecordSchema = new mongoose.Schema({
    appointmentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointments',
        required: true,
    },
    suggestedTest: {
        type: String
    },
    prescription: {
        type: String
    },
    createdAt: {
        type: Date
    },
});

module.exports = mongoose.model('healthRecords', HealthRecordSchema);