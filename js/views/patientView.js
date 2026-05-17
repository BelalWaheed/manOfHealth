import { AppState } from "../state/AppState.js";
import { formatTimeAMPM } from "../utils/helpers.js";
import { processAppointmentBooking } from "../controllers/appointmentController.js";
import { renderView } from "./router.js";

export function renderPatientDashboard(container) {
  const patient = AppState.currentUser;
  if (!patient || patient.role !== "Patient") {
    container.innerHTML = `<div class="text-center mt-10 text-red-500">Access Denied. Please log in as a patient.</div>`;
    return;
  }
  renderDashboardScreen(container, patient);
}

function renderDashboardScreen(container, patient) {
  const myAppointments = AppState.clinic.appointments.filter(
    (a) => a.patientId === patient.id,
  );

  const html = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-gray-800">Patient Portal</h2>
            <div class="flex items-center gap-4">
                <span class="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">Logged in as: ${patient.name}</span>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Schedule Appointment</h3>
                
                <form id="book-appointment-form" class="space-y-5" novalidate>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Specialist</label>
                        <select id="select-doctor" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border" required>
                            <option value="" disabled selected>-- Choose a doctor --</option>
                            ${AppState.clinic.doctors.map((d) => `<option value="${d.id}">Dr. ${d.name} (${d.specialty})</option>`)}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Available Time Slot</label>
                        <select id="select-slot" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border bg-gray-50" required disabled>
                            <option value="" disabled selected>Select a doctor first</option>
                        </select>
                    </div>
                    
                    <div id="book-error" class="hidden text-sm text-red-600 bg-red-50 p-2 rounded"></div>
                    
                    <button type="submit" id="book-btn" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Confirm Booking
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">My Appointments</h3>
                <div class="space-y-4 max-h-[500px] overflow-y-auto">
                    ${myAppointments.length === 0 ? '<div class="text-center py-8 text-gray-500 italic">No appointments booked yet.</div>' : ""}
                    ${myAppointments
      .map((a) => {
        const doc = AppState.clinic.doctors.find(
          (d) => d.id === a.doctorId,
        );
        return `
                        <div class="p-4 border border-green-100 rounded-lg bg-green-50/50 relative">
                            <span class="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">${a.status}</span>
                            <p class="font-bold text-gray-900 text-lg mb-1">${a.date} at ${formatTimeAMPM(a.time)}</p>
                            <p class="text-sm text-gray-600 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                Dr. ${doc ? doc.name : "Unknown Specialist"}
                            </p>
                        </div>
                        `;
      })
      .join("")}
                </div>
            </div>
        </div>
    `;

  container.innerHTML = html;

  const selectDoctor = document.getElementById("select-doctor");
  const selectSlot = document.getElementById("select-slot");
  const bookBtn = document.getElementById("book-btn");

  selectDoctor.addEventListener("change", (e) => {
    const docId = e.target.value;
    const doctor = AppState.clinic.doctors.find((d) => d.id === docId);

    selectSlot.innerHTML =
      '<option value="" disabled selected>-- Select a time --</option>';
    selectSlot.classList.remove("bg-gray-50");

    if (doctor && doctor.availableSlots.length > 0) {
      const now = new Date();
      const futureSlots = doctor.availableSlots.filter(
        (s) => new Date(s.date + "T" + s.time) > now,
      );

      if (futureSlots.length > 0) {
        const sortedSlots = [...futureSlots].sort((a, b) => {
          const dateA = new Date(a.date + "T" + a.time);
          const dateB = new Date(b.date + "T" + b.time);
          return dateA - dateB;
        });

        sortedSlots.forEach((s) => {
          const opt = document.createElement("option");
          opt.value = JSON.stringify({ date: s.date, time: s.time });
          opt.textContent = `${s.date} @ ${formatTimeAMPM(s.time)}`;
          selectSlot.appendChild(opt);
        });
        selectSlot.disabled = false;
      } else {
        selectSlot.innerHTML =
          '<option value="" disabled selected>No future slots available</option>';
        selectSlot.disabled = true;
        bookBtn.disabled = true;
        selectSlot.classList.add("bg-gray-50");
      }
    } else {
      selectSlot.innerHTML =
        '<option value="" disabled selected>No slots available</option>';
      selectSlot.disabled = true;
      bookBtn.disabled = true;
      selectSlot.classList.add("bg-gray-50");
    }
  });

  selectSlot.addEventListener("change", () => {
    bookBtn.disabled = !selectSlot.value;
  });

  document
    .getElementById("book-appointment-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const errorEl = document.getElementById("book-error");
      errorEl.classList.add("hidden");

      try {
        const docId = selectDoctor.value;
        const slotVal = selectSlot.value;

        if (!docId || !slotVal)
          throw new Error("Please select both a doctor and a valid time slot.");

        const { date, time } = JSON.parse(slotVal);

        processAppointmentBooking(patient.id, docId, date, time);

        renderView("Patient");
      } catch (error) {
        console.error(error);
        errorEl.textContent = error.message;
        errorEl.classList.remove("hidden");
      }
    });
}
