import { renderAdminDashboard } from './adminView.js';
import { renderDoctorDashboard } from './doctorView.js';
import { renderPatientDashboard } from './patientView.js';
import { renderAuthScreen } from './authView.js';
import { AppState } from '../state/AppState.js';

export function renderView(viewType) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    updateNavbar();

    try {
        switch (viewType) {
            case 'Admin':
                renderAdminDashboard(mainContent);
                break;
            case 'Doctor':
                renderDoctorDashboard(mainContent);
                break;
            case 'Patient':
                renderPatientDashboard(mainContent);
                break;
            case 'Auth':
            default:
                renderAuthScreen(mainContent);
        }
    } catch (error) {
        console.error("DOM Rendering Error:", error);
        mainContent.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                <h3 class="font-bold">Rendering Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function updateNavbar() {
    const navContainer = document.getElementById('dynamic-nav-container');
    if (!navContainer) return;

    if (!AppState.currentUser) {
        navContainer.innerHTML = '';
        return;
    }

    const role = AppState.currentUser.role;
    let navLinks = '';

    if (role === 'Admin') {
        navLinks += `<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm font-medium mr-4">Admin Mode</span>`;
    } else if (role === 'Doctor') {
        navLinks += `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium mr-4">${AppState.currentUser.name.startsWith('Dr.') ? AppState.currentUser.name : 'Dr. ' + AppState.currentUser.name}</span>`;
    } else if (role === 'Patient') {
        navLinks += `<span class="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium mr-4">Patient: ${AppState.currentUser.name}</span>`;
    }

    navLinks += `<button id="global-logout-btn" class="text-sm font-semibold text-gray-500 hover:text-red-500 transition">Log out</button>`;
    navContainer.innerHTML = navLinks;

    const logoutBtn = document.getElementById('global-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AppState.currentUser = null;
            AppState.save();
            renderView('Auth');
        });
    }
}
