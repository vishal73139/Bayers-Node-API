const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    DOB: {
        type: Date
    },
    availableTimeSlot: {
        type: [Date]
    },
    createdAt: {
        type: Date
    },
    SpecialtyIn: {
        type: String
    }
});

module.exports = mongoose.model('doctors', DoctorSchema);