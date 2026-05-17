import { AppState } from '../state/AppState.js';

export function processAdminLogin(username, password) {
    if (username === 'hola' && password === 'hola123') {
        return { id: 'admin-1', name: 'Admin', role: 'Admin' };
    }
    throw new Error('Invalid Admin credentials.');
}

export function processDoctorLogin(phone, password) {
    if (!phone || phone.trim() === '') throw new Error("Please enter phone number.");
    if (!password) throw new Error("Please enter password.");

    const doc = AppState.clinic.doctors.find(d => 
        d.phone === phone.trim() && 
        d.password === password
    );

    if (!doc) {
        throw new Error('Invalid phone number or password. Please check your credentials.');
    }

    return doc;
}
