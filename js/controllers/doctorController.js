import { Doctor } from '../models/Doctor.js';
import { AppState } from '../state/AppState.js';
import { generateId } from '../utils/helpers.js';

export function processDoctorCreation(name, specialty) {
    if (!name || name.trim() === '') throw new Error("Doctor name cannot be empty.");
    if (!specialty || specialty.trim() === '') throw new Error("Specialty cannot be empty.");
    
    const newDoc = new Doctor(generateId(), name.trim(), specialty.trim());
    AppState.clinic.doctors.push(newDoc);
    AppState.save();
    return newDoc;
}

export function removeDoctorFromSystem(doctorId) {
    const initialCount = AppState.clinic.doctors.length;
    AppState.clinic.doctors = AppState.clinic.doctors.filter(d => d.id !== doctorId);
    
    if (AppState.clinic.doctors.length === initialCount) {
        throw new Error("Doctor not found.");
    }
    
    // Cascade delete related appointments
    AppState.clinic.appointments = AppState.clinic.appointments.filter(a => a.doctorId !== doctorId);
    AppState.save();
}
