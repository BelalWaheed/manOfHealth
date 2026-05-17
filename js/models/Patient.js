import { User } from './User.js';

export class Patient extends User {
    constructor(id, name, phone, password) {
        super(id, name, phone, 'Patient', password);
    }
}
