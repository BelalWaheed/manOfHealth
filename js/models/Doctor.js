import { User } from './User.js';

export class Doctor extends User {
    constructor(id, name, specialty) {
        super(id, name, 'Doctor');
        this.specialty = specialty;
        this.availableSlots = []; // Array of objects: { date: 'YYYY-MM-DD', time: 'HH:MM' }
    }
    
    addSlot(date, time) {
        const exists = this.availableSlots.find(s => s.date === date && s.time === time);
        if (!exists) {
            this.availableSlots.push({ date, time });
        } else {
            throw new Error("This time slot already exists.");
        }
    }
    
    removeSlot(date, time) {
        this.availableSlots = this.availableSlots.filter(s => !(s.date === date && s.time === time));
    }
}
