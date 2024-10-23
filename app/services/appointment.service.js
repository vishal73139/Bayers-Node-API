const Appointment = require('../models/appointments.model');

const findUpcomingAppointments = async patientId => {
    return await Appointment.find({ patientId: patientId, date: { $gt: new Date() } });
};

const createAppointment = async appointmentDetails => {
    return await Appointment.create(appointmentDetails)
}

module.exports = {
    findUpcomingAppointments,
    createAppointment
};
