"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const pool = new pg_1.Pool({
    connectionString: env_1.config.db.connectionString,
});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
const query = (text, params) => pool.query(text, params);
exports.query = query;
const getClient = () => pool.connect();
exports.getClient = getClient;
// Helper to initialize table schemas
const initDb = async () => {
    const client = await (0, exports.getClient)();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE RESTRICT,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
        CONSTRAINT valid_dates CHECK (rent_end_date > rent_start_date)
      );
    `);
        console.log('Database tables initialized securely!');
    }
    catch (error) {
        console.error('Error initializing database tables:', error);
    }
    finally {
        client.release();
    }
};
exports.initDb = initDb;
