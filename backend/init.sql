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


    CREATE TABLE services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        status ENUM('enable', 'disable') NOT NULL
    );

    DROP TABLE IF EXISTS Medicines;

    CREATE TABLE Medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,  -- Changed to VARCHAR
        inStock BOOLEAN NOT NULL,
        measure VARCHAR(50) NOT NULL
    );
