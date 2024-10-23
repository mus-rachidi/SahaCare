CREATE DATABASE IF NOT EXISTS healthcare;

USE healthcare;

CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(50),
    image VARCHAR(255),
    admin BOOLEAN,
    email VARCHAR(100),
    phone VARCHAR(15),
    age INT,
    gender VARCHAR(10),
    totalAppointments INT,
    amount DECIMAL(10, 2) DEFAULT 0,
    status ENUM('Paid', 'Pending', 'Cancel') DEFAULT 'Pending',
    PaymentDate DATE,
    services VARCHAR(255),
    price DECIMAL(10, 2) DEFAULT 0
);


CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('enable', 'disable') NOT NULL
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



DROP TABLE IF EXISTS Medicines;

CREATE TABLE Medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL, 
    inStock BOOLEAN NOT NULL,
    measure VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS Invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL, 
    doctor_id BIGINT UNSIGNED NOT NULL, 
    total_amount DECIMAL(10, 2) NOT NULL,
    created_date DATE NOT NULL,  
    due_date DATE NOT NULL,      
    status ENUM('paid', 'unpaid', 'pending') NOT NULL,
    services_rendered JSON NOT NULL,  
    FOREIGN KEY (patient_id) REFERENCES Patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

