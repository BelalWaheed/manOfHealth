import { Patient } from '../models/Patient.js';
import { AppState } from '../state/AppState.js';
import { generateId } from '../utils/helpers.js';

export function processPatientCreation(name, phone, password) {
    if (!name || name.trim() === '') throw new Error("Patient name cannot be empty.");
    if (!phone || phone.trim() === '') throw new Error("Phone number cannot be empty.");
    if (!password || password.length < 4) throw new Error("Password must be at least 4 characters long.");
    
    let existingAccount = AppState.clinic.patients.find(p => p.phone === phone.trim());
    if (existingAccount) {
        throw new Error("An account with this phone number already exists. Please log in.");
    }

    const newPatient = new Patient(generateId(), name.trim(), phone.trim(), password);
    AppState.clinic.patients.push(newPatient);
    AppState.save();
    return newPatient;
}

export function processPatientLogin(phone, password) {
    if (!phone || phone.trim() === '') throw new Error("Please enter your phone number to log in.");
    if (!password) throw new Error("Please enter your password.");
    
    let patient = AppState.clinic.patients.find(p => 
        p.phone === phone.trim() && 
        p.password === password
    );
    
    if (!patient) {
        throw new Error("Invalid phone number or password. Please try again or register.");
    }
    
    return patient;
}
