import { AppState } from '../state/AppState.js';
import { processDoctorCreation, removeDoctorFromSystem } from '../controllers/doctorController.js';
import { formatTimeAMPM } from '../utils/helpers.js';
import { renderView } from './router.js';

export function renderAdminDashboard(container) {
    if (!AppState.currentUser || AppState.currentUser.role !== 'Admin') {
        container.innerHTML = `<div class="text-center mt-10 text-red-500">Access Denied. Administrator privileges required.</div>`;
        return;
    }

    const statsHtml = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Appointments</h3>
                    <p class="text-4xl font-bold text-gray-900 mt-1">${AppState.clinic.appointments.length}</p>
                </div>
                <div class="p-3 bg-blue-50 text-blue-600 rounded-full">📅</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Doctors</h3>
                    <p class="text-4xl font-bold text-gray-900 mt-1">${AppState.clinic.doctors.length}</p>
                </div>
                <div class="p-3 bg-green-50 text-green-600 rounded-full">👨‍⚕️</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Registered Patients</h3>
                    <p class="text-4xl font-bold text-gray-900 mt-1">${AppState.clinic.patients.length}</p>
                </div>
                <div class="p-3 bg-purple-50 text-purple-600 rounded-full">🧑‍🤝‍🧑</div>
            </div>
        </div>
    `;


    const addDoctorHtml = `
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Onboard New Doctor</h3>
            <form id="add-doctor-form" class="space-y-4" novalidate>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="doc-name" placeholder="e.g. Feras Keshta" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" id="doc-phone" placeholder="e.g. 0501234567" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                        <input type="text" id="doc-specialty" placeholder="e.g. Pediatrics" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="text" id="doc-pass" placeholder="e.g. doc123" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border" required>
                    </div>
                </div>
                <div id="add-doc-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm">
                    Add Doctor
                </button>
            </form>
        </div>
    `;


    const doctorsListHtml = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-bold text-gray-800">Staff Roster</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="doctors-tbody" class="bg-white divide-y divide-gray-200">
                        ${AppState.clinic.doctors.length === 0 ? `<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No doctors found.</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const allAppointments = AppState.clinic.appointments;

    const appointmentsListHtml = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800">All Appointments</h3>
                <span class="text-sm text-gray-500">Full Record</span>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody id="week-appointments-tbody" class="bg-white divide-y divide-gray-200">
                        ${allAppointments.length === 0 ? `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No appointments scheduled.</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = `<h2 class="text-2xl font-bold mb-6 text-gray-800">Administration Overview</h2>` + statsHtml + addDoctorHtml + doctorsListHtml + appointmentsListHtml;


    const tbody = document.getElementById('doctors-tbody');
    AppState.clinic.doctors.forEach(doc => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition";
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${doc.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">${doc.specialty}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-red-600 hover:text-red-900 delete-doc-btn font-semibold" data-id="${doc.id}">Dismiss</button>
            </td>
        `;
        tbody.appendChild(tr);
    });


    const aptTbody = document.getElementById('week-appointments-tbody');
    if (aptTbody && allAppointments.length > 0) {
        allAppointments.sort((a, b) => {
            return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
        }).forEach(apt => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition";
            const patient = AppState.clinic.patients.find(p => p.id === apt.patientId);
            const doc = AppState.clinic.doctors.find(d => d.id === apt.doctorId);
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${apt.date} at ${formatTimeAMPM(apt.time)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient ? patient.name : 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doc ? (doc.name.startsWith('Dr.') ? doc.name : 'Dr. ' + doc.name) : 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">${apt.status}</span>
                </td>
            `;
            aptTbody.appendChild(tr);
        });
    }


    document.getElementById('add-doctor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('add-doc-error');
        errorEl.classList.add('hidden');

        const name = document.getElementById('doc-name').value;
        const phone = document.getElementById('doc-phone').value;
        const specialty = document.getElementById('doc-specialty').value;
        const password = document.getElementById('doc-pass').value;

        try {
            processDoctorCreation(name, phone, specialty, password);
            renderView('Admin'); 
        } catch (error) {
            console.error(error);
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        }
    });

    document.querySelectorAll('.delete-doc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm("Are you sure you want to remove this doctor and their appointments?")) {
                try {
                    removeDoctorFromSystem(id);
                    renderView('Admin');
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
}
