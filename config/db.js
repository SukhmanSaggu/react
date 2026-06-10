import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jobs',
  ssl: process.env.DB_PORT ? { rejectUnauthorized: false } : undefined,
};

let db;

const connectDB = async () => {
  db = await mysql.createConnection(dbConfig);

  await db.execute(`
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
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin2 (
      id INT PRIMARY KEY,
      password VARCHAR(45)
    )
  `);

  const [adminRows] = await db.execute('SELECT * FROM admin2');
  if (adminRows.length === 0) {
    await db.execute('INSERT INTO admin2 (id, password) VALUES (0, ?)', ['saggu123']);
  }

  await db.execute(`
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
    FROM addjob
  `);

  return db;
};

const getDB = () => {
  if (!db) {
    throw new Error('Database is not connected');
  }

  return db;
};

export { connectDB, getDB };
