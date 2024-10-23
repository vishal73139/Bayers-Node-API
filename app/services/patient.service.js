const Patient = require('../models/patients.model');

const findPatientByUserId = async userId => {
    return await Patient.findOne({ userId: userId });
};

const savePatient = async patient => {
    return await Patient.create(patient);
};

const updatePatient = async (userId, patientDetails) => {
    return await Patient.findOneAndUpdate({ userId: userId }, { ...patientDetails })
}

module.exports = {
    findPatientByUserId,
    savePatient,
    updatePatient
};
