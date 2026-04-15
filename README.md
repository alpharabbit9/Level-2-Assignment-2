# Vehicle Rental System API

A production-ready backend API for a Vehicle Rental System built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication and secure bcrypt password hashing.
- **Role-Based Access Control**: Different access levels for Admin and Customer roles.
- **Vehicle Management**: Admins can manage the vehicle fleet (CRUD operations).
- **Booking System**: Customers can book available vehicles. Includes auto-calculation of rental prices.
- **Validation**: Strict validation rules for inputs, such as valid dates and available vehicles.
- **Relational Integrity**: Built on PostgreSQL ensuring cascading constraints and state synchronization between bookings and vehicle availability.

## Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Security:** bcrypt (password hashing), jsonwebtoken (JWT Auth)

## Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) installed
- [PostgreSQL](https://www.postgresql.org/) database installed and running

### 2. Clone and install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables

Rename \`.env.example\` to \`.env\` and update the database connection string and JWT secret:

\`\`\`env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/vehicle_rental
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
\`\`\`

### 4. Create Database

Ensure that the \`vehicle_rental\` database exists in your PostgreSQL instance. The server auto-initializes the required tables (\`users\`, \`vehicles\`, \`bookings\`) securely on startup.

### 5. Running the Application

**Development mode:**
\`\`\`bash
npm run dev
\`\`\`

**Production mode:**
\`\`\`bash
npm run build
npm start
\`\`\`

## API Overview

### Custom Headers
For protected routes, provide the JWT in the header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

### Endpoints

**(AUTH)**
- \`POST /api/v1/auth/signup\` - Register a new user
- \`POST /api/v1/auth/signin\` - Login to the system

**(VEHICLES)**
- \`POST /api/v1/vehicles\` - Create a vehicle (Admin)
- \`GET /api/v1/vehicles\` - Get all vehicles
- \`GET /api/v1/vehicles/:vehicleId\` - Get specific vehicle
- \`PUT /api/v1/vehicles/:vehicleId\` - Update vehicle (Admin)
- \`DELETE /api/v1/vehicles/:vehicleId\` - Delete vehicle (Admin)

**(USERS)**
- \`GET /api/v1/users\` - Get all users (Admin)
- \`PUT /api/v1/users/:userId\` - Update user (Admin or Own Profile)
- \`DELETE /api/v1/users/:userId\` - Delete user (Admin)

**(BOOKINGS)**
- \`POST /api/v1/bookings\` - Create a booking
- \`GET /api/v1/bookings\` - Retrieve bookings (Admin sees all, Customer sees own)
- \`PUT /api/v1/bookings/:bookingId\` - Update booking (Customer cancels, Admin marks as returned)

## Example Request

**Create Booking:**
\`\`\`http
POST /api/v1/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "vehicle_id": 1,
  "rent_start_date": "2024-05-01",
  "rent_end_date": "2024-05-05"
}
\`\`\`

**Success Response:**
\`\`\`json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 2,
    "vehicle_id": 1,
    "rent_start_date": "2024-05-01",
    "rent_end_date": "2024-05-05",
    "total_price": "200.00",
    "status": "active"
  }
}
\`\`\`
