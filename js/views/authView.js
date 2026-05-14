import { AppState } from '../state/AppState.js';
import { processPatientLogin, processPatientCreation } from '../controllers/patientController.js';
import { processAdminLogin, processDoctorLogin } from '../controllers/authController.js';
import { renderView } from './router.js';

export function renderAuthScreen(container) {
    const html = `
        <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Man of Health Login</h2>
            
            <div class="mb-6 flex border-b border-gray-200">
                <button id="tab-patient" class="flex-1 py-2 text-center font-medium text-blue-600 border-b-2 border-blue-600 transition">Patient</button>
                <button id="tab-doctor" class="flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-700 transition">Doctor</button>
                <button id="tab-admin" class="flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-700 transition">Admin</button>
            </div>


            <div id="patient-auth-section" class="block fade-in">
                <div class="flex gap-2 mb-4">
                    <button id="mode-login" class="flex-1 text-sm font-semibold bg-gray-100 py-1 rounded transition">Login</button>
                    <button id="mode-register" class="flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-1 rounded transition">Register</button>
                </div>
                <form id="patient-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
                        <input type="text" id="patient-name" placeholder="e.g. John Doe" class="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div id="patient-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                    <button type="submit" id="patient-submit-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition shadow-sm">Log In</button>
                </form>
            </div>


            <div id="doctor-auth-section" class="hidden fade-in">
                <form id="doctor-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input type="text" id="doctor-name" placeholder="e.g. Gregory House" class="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div id="doctor-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition shadow-sm">Log In</button>
                </form>
            </div>


            <div id="admin-auth-section" class="hidden fade-in">
                <form id="admin-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" id="admin-user" class="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="admin-pass" class="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div id="admin-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition shadow-sm">Log In</button>
                </form>
            </div>
        </div>
    `;

    container.innerHTML = html;


    const tabs = ['patient', 'doctor', 'admin'];
    tabs.forEach(tab => {
        document.getElementById(`tab-${tab}`).addEventListener('click', () => {
            tabs.forEach(t => {
                const btn = document.getElementById(`tab-${t}`);
                if (t === tab) {
                    btn.className = 'flex-1 py-2 text-center font-medium text-blue-600 border-b-2 border-blue-600 transition';
                    document.getElementById(`${t}-auth-section`).classList.remove('hidden');
                    document.getElementById(`${t}-auth-section`).classList.add('block');
                } else {
                    btn.className = 'flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-700 transition';
                    document.getElementById(`${t}-auth-section`).classList.add('hidden');
                    document.getElementById(`${t}-auth-section`).classList.remove('block');
                }
            });
        });
    });


    let patientMode = 'login';
    document.getElementById('mode-login').addEventListener('click', () => {
        patientMode = 'login';
        document.getElementById('mode-login').className = 'flex-1 text-sm font-semibold bg-gray-100 py-1 rounded transition';
        document.getElementById('mode-register').className = 'flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-1 rounded transition';
        document.getElementById('patient-submit-btn').textContent = 'Log In';
    });
    document.getElementById('mode-register').addEventListener('click', () => {
        patientMode = 'register';
        document.getElementById('mode-register').className = 'flex-1 text-sm font-semibold bg-gray-100 py-1 rounded transition';
        document.getElementById('mode-login').className = 'flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-1 rounded transition';
        document.getElementById('patient-submit-btn').textContent = 'Create Account';
    });


    document.getElementById('patient-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('patient-error');
        errorEl.classList.add('hidden');
        try {
            const name = document.getElementById('patient-name').value;
            if (!name) throw new Error("Please enter your name.");
            const patient = patientMode === 'login' ? processPatientLogin(name) : processPatientCreation(name);
            AppState.currentUser = patient;
            AppState.save();
            renderView('Patient');
        } catch(err) {
            errorEl.textContent = err.message;
            errorEl.classList.remove('hidden');
        }
    });

    document.getElementById('doctor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('doctor-error');
        errorEl.classList.add('hidden');
        try {
            const name = document.getElementById('doctor-name').value;
            if (!name) throw new Error("Please enter doctor name.");
            const doctor = processDoctorLogin(name);
            AppState.currentUser = doctor;
            AppState.save();
            renderView('Doctor');
        } catch(err) {
            errorEl.textContent = err.message;
            errorEl.classList.remove('hidden');
        }
    });

    document.getElementById('admin-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('admin-error');
        errorEl.classList.add('hidden');
        try {
            const user = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;
            if (!user || !pass) throw new Error("Username and password are required.");
            const admin = processAdminLogin(user, pass);
            AppState.currentUser = admin;
            AppState.save();
            renderView('Admin');
        } catch(err) {
            errorEl.textContent = err.message;
            errorEl.classList.remove('hidden');
        }
    });
}
