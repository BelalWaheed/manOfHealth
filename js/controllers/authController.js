import { AppState } from '../state/AppState.js';

export function processAdminLogin(username, password) {
    if (username === 'hola' && password === 'hola123') {
        return { id: 'admin-1', name: 'Admin', role: 'Admin' };
    }
    throw new Error('Invalid Admin credentials.');
}

export function processDoctorLogin(name) {
    const doc = AppState.clinic.doctors.find(d => 
        d.name.toLowerCase() === name.toLowerCase() || 
        d.name.toLowerCase() === `dr. ${name.toLowerCase()}`
    );
    if (!doc) {
        throw new Error('Doctor not found in the system. Please ask an Admin to onboard you.');
    }
    return doc;
}
