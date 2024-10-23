const Appointment = require('../models/appointments.model');

const findUpcomingAppointments = async patientId => {
    return await Appointment.find({ patientId: patientId, date: { $gt: new Date() } });
};

module.exports = {
    findUpcomingAppointments
};
