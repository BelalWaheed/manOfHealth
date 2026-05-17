import { Appointment } from '../models/Appointment.js';
import { AppState } from '../state/AppState.js';
import { generateId } from '../utils/helpers.js';

export function processAppointmentBooking(patientId, doctorId, date, time) {
    if (!patientId || !doctorId || !date || !time) {
        throw new Error("Invalid booking parameters. All fields required.");
    }
    
    const doctor = AppState.clinic.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new Error("Selected doctor no longer exists in the system.");
    
    const slotExists = doctor.availableSlots.find(s => s.date === date && s.time === time);
    if (!slotExists) throw new Error("Selected time slot is no longer available.");
    
    const appointment = new Appointment(generateId(), patientId, doctorId, date, time);
    AppState.clinic.appointments.push(appointment);
    
    doctor.removeSlot(date, time);
    AppState.save();
    
    return appointment;
}
