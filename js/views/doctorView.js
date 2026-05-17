import { AppState } from '../state/AppState.js';
import { formatTimeAMPM } from '../utils/helpers.js';
import { renderView } from './router.js';

export function renderDoctorDashboard(container) {
    const doctor = AppState.currentUser;

    if (!doctor || doctor.role !== 'Doctor') {
        container.innerHTML = `<div class="text-center mt-10 text-red-500">Access Denied. Please log in as a doctor.</div>`;
        return;
    }

    const myAppointments = AppState.clinic.appointments.filter(a => a.doctorId === doctor.id);

    const html = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
            <div class="flex items-center gap-2">
                <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Schedule for ${doctor.name.startsWith('Dr.') ? doctor.name : 'Dr. ' + doctor.name}</span>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Manage Availability</h3>
                
                <form id="add-slot-form" class="space-y-4 mb-6" novalidate>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" id="slot-date" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input type="time" id="slot-time" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border" required>
                        </div>
                    </div>
                    <div id="slot-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition shadow-sm">
                        Add Working Slot
                    </button>
                </form>
                
                <h4 class="font-semibold text-gray-700 mb-3">Published Slots</h4>
                <ul class="space-y-2 max-h-60 overflow-y-auto  " id="available-slots-list">
                    ${doctor.availableSlots.length === 0 ? '<li class="text-gray-500 text-sm italic">No open slots published.</li>' : ''}
                    ${doctor.availableSlots.map(s => `
                        <li class="flex justify-between items-center bg-gray-50 border p-3 rounded-md">
                            <div class="flex items-center text-gray-800 text-sm">
                                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ${s.date} <span class="mx-2 font-bold">•</span> ${formatTimeAMPM(s.time)}
                            </div>
                            <button class="text-red-500 hover:text-red-700 text-sm font-medium remove-slot-btn transition" data-date="${s.date}" data-time="${s.time}">Remove</button>
                        </li>
                    `).join('')}
                </ul>
            </div>


            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Upcoming Appointments</h3>
                <div class="space-y-4 max-h-[500px] overflow-y-auto">
                    ${myAppointments.length === 0 ? '<div class="text-center py-8 text-gray-500 italic">No appointments scheduled.</div>' : ''}
                    ${myAppointments.map(a => {
        const patient = AppState.clinic.patients.find(p => p.id === a.patientId);
        return `
                        <div class="p-4 border border-blue-100 rounded-lg bg-blue-50/50 relative">
                            <span class="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">${a.status}</span>
                            <p class="font-bold text-gray-900 text-lg mb-1">${a.date} at ${formatTimeAMPM(a.time)}</p>
                            <p class="text-sm text-gray-600 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Patient: ${patient ? patient.name : 'Unknown Record'}
                            </p>
                        </div>
                        `;
    }).join('')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;


    document.getElementById('add-slot-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('slot-error');
        errorEl.classList.add('hidden');

        try {
            const date = document.getElementById('slot-date').value;
            const time = document.getElementById('slot-time').value;

            if (!date || !time) throw new Error("Please select both a date and a time.");


            const slotDateTime = new Date(date + 'T' + time);
            const now = new Date();
            if (slotDateTime <= now) throw new Error("Cannot add slots in the past.");

            doctor.addSlot(date, time);
            AppState.save();
            renderView('Doctor');
        } catch (error) {
            console.error(error);
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        }
    });

    document.querySelectorAll('.remove-slot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const date = e.target.getAttribute('data-date');
            const time = e.target.getAttribute('data-time');
            try {
                doctor.removeSlot(date, time);
                AppState.save();
                renderView('Doctor');
            } catch (error) {
                console.error(error);
            }
        });
    });
}
