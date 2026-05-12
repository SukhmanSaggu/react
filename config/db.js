import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jobs',
};

let db;

const connectDB = async () => {
  db = await mysql.createConnection(dbConfig);

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
