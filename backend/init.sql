-- Create Database
CREATE DATABASE IF NOT EXISTS healthcare;

-- Use the healthcare database
USE healthcare;

-- Create the Patients table
CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(50),
    image VARCHAR(255),
    admin BOOLEAN,
    email VARCHAR(100),
    phone VARCHAR(15),
    age INT,
    gender VARCHAR(10),
    blood VARCHAR(5),
    totalAppointments INT,
    date DATE
);

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Receptions (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
);
