import { Clinic } from '../models/Clinic.js';
import { Doctor } from '../models/Doctor.js';
import { Patient } from '../models/Patient.js';
import { Appointment } from '../models/Appointment.js';
import { generateId} from '../utils/helpers.js';

export const AppState = {
    clinic: new Clinic("Man of Health Primary"),
    currentUser: null,
    currentDoctorViewId: null,
    
    load() {
        try {
            const data = localStorage.getItem('manOfHealthData');
            if (data) {
                const parsed = JSON.parse(data);
                
                this.clinic.doctors = parsed.doctors.map(d => {
                    const doc = new Doctor(d.id, d.name, d.specialty);
                    doc.availableSlots = d.availableSlots || [];
                    return doc;
                });
                
                this.clinic.patients = parsed.patients.map(p => new Patient(p.id, p.name));
                this.clinic.appointments = parsed.appointments.map(a => new Appointment(a.id, a.patientId, a.doctorId, a.date, a.time));

                if (parsed.session) {
                    if (parsed.session.role === 'Admin') {
                        this.currentUser = { id: 'admin-1', name: 'Admin', role: 'Admin' };
                    } else if (parsed.session.role === 'Doctor') {
                        this.currentUser = this.clinic.doctors.find(d => d.id === parsed.session.id);
                    } else if (parsed.session.role === 'Patient') {
                        this.currentUser = this.clinic.patients.find(p => p.id === parsed.session.id);
                    }
                }
            } else {
                this.seedData();
            }
        } catch (error) {
            console.error("Critical State Error: Failed to parse localStorage data", error);
            this.seedData();
        }
    },
    
    save() {
        try {
            const data = {
                doctors: this.clinic.doctors,
                patients: this.clinic.patients,
                appointments: this.clinic.appointments,
                session: this.currentUser ? { id: this.currentUser.id, role: this.currentUser.role } : null
            };
            localStorage.setItem('manOfHealthData', JSON.stringify(data));
        } catch (error) {
            console.error("Critical State Error: Failed to save to localStorage", error);
        }
    },
    
    seedData() {
        const doc1 = new Doctor(generateId(), "Dr. Gregory House", "Diagnostic Medicine");
        doc1.addSlot("2026-05-10", "09:00");
        doc1.addSlot("2026-05-10", "10:30");
        
        const doc2 = new Doctor(generateId(), "Dr. Allison Cameron", "Immunology");
        doc2.addSlot("2026-05-11", "11:00");

        this.clinic.doctors.push(doc1, doc2);
        
        const pat1 = new Patient(generateId(), "John Doe");
        this.clinic.patients.push(pat1);
        
        this.save();
    }
};
