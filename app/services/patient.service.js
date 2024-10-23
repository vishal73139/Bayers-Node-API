const Patient = require('../models/patients.model');

const findPatientByUserId = async userId => {
    return await Patient.findOne({ userId: userId });
};

const findPatientById = async patientId => {
    return await Patient.findOne({_id: patientId})
}

const savePatient = async patient => {
    return await Patient.create(patient);
};

const updatePatient = async (userId, patientDetails) => {
    return await Patient.findOneAndUpdate({ userId: userId }, { ...patientDetails })
}

module.exports = {
    findPatientByUserId,
    savePatient,
    updatePatient,
    findPatientById
};
