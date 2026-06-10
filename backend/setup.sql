-- Create database
CREATE DATABASE IF NOT EXISTS jobs;

-- Use the database
USE jobs;

-- Create the addjob table
CREATE TABLE IF NOT EXISTS addjob (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    salary VARCHAR(50),
    company_name VARCHAR(255),
    company_description TEXT,
    company_contact_email VARCHAR(255),
    company_contact_phone VARCHAR(50)
);

-- Create a view for reading job listings
CREATE OR REPLACE VIEW view_jobs AS
SELECT
    id,
    title,
    type,
    location,
    description,
    salary,
    company_name,
    company_description,
    company_contact_email AS contact_email,
    company_contact_phone AS contact_phone
FROM addjob;

-- Optional: Insert sample data
