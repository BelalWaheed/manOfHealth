# Man of Health - Clinic Management System

A web application for managing clinic operations, including patient bookings and doctor schedules.

## Features

### Authentication

- Single login interface for all roles.
- Role-based routing to restrict access to unauthorized views.

### Patient Portal

- Login or register with full name.
- View available doctors and their time slots.
- Book appointments.
- View appointment history.

### Doctor Dashboard

- Login with doctor name.
- Publish availability by adding date and time slots.
- View upcoming scheduled appointments.

### Admin Dashboard

- **Credentials:** Username: `hola` | Password: `hola123`
- View system statistics (total appointments, active doctors, registered patients).
- Onboard or remove doctors.
- Monitor global appointment feed.

## Technology Stack

- HTML5, Vanilla JavaScript (ES6 Modules)
- Tailwind CSS
- LocalStorage

## How to Run

Run the application using a local web server (e.g., Live Server, http-server) to support ES6 module imports.

## Project Structure

```text
/project
│   index.html
│   README.md
│
└───js/
    │   main.js
    ├───controllers/
    ├───models/
    ├───state/
    ├───utils/
    └───views/
```
