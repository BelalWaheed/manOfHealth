import { Patient } from '../models/Patient.js';
import { AppState } from '../state/AppState.js';
import { generateId } from '../utils/helpers.js';

export function processPatientCreation(name) {
    if (!name || name.trim() === '') throw new Error("Patient name cannot be empty.");
    
    let existingPatient = AppState.clinic.patients.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (existingPatient) {
        throw new Error("A patient with this name already exists. Please log in.");
    }

    const newPatient = new Patient(generateId(), name.trim());
    AppState.clinic.patients.push(newPatient);
    AppState.save();
    return newPatient;
}

export function processPatientLogin(name) {
    if (!name || name.trim() === '') throw new Error("Please enter your name to log in.");
    
    let existingPatient = AppState.clinic.patients.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (!existingPatient) {
        throw new Error("Patient not found. Please create a new account.");
    }
    
    return existingPatient;
}
