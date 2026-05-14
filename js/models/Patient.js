import { User } from './User.js';

export class Patient extends User {
    constructor(id, name) {
        super(id, name, 'Patient');
    }
}
