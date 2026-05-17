import { Doctor } from '../models/Doctor.js';
import { AppState } from '../state/AppState.js';
import { generateId } from '../utils/helpers.js';

export function processDoctorCreation(name, phone, specialty, password) {
    if (!name || name.trim() === '') throw new Error("Doctor name cannot be empty.");
    if (!phone || phone.trim() === '') throw new Error("Phone number cannot be empty.");
    if (!specialty || specialty.trim() === '') throw new Error("Specialty cannot be empty.");
    if (!password || password.length < 4) throw new Error("Password must be at least 4 characters long.");
    
    let existingAccount = AppState.clinic.doctors.find(d => d.phone === phone.trim());
    if (existingAccount) {
        throw new Error("A doctor with this phone number already exists.");
    }

    const newDoc = new Doctor(generateId(), name.trim(), phone.trim(), specialty.trim(), password);
    AppState.clinic.doctors.push(newDoc);
    AppState.save();
    return newDoc;
}

export function removeDoctorFromSystem(doctorId) {
    AppState.clinic.doctors = AppState.clinic.doctors.filter(d => d.id !== doctorId);
    AppState.clinic.appointments = AppState.clinic.appointments.filter(a => a.doctorId !== doctorId);
    AppState.save();
}
