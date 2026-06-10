import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('=== Database Migration Utility ===');
  console.log('This script will copy all tables and data from your local MySQL instance to the Cloud SQL database.\n');

  // Load target configuration from .env
  const targetConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_PORT ? { rejectUnauthorized: false } : undefined
  };

  console.log('Target Database Configuration (from .env):');
  console.log(`Host: ${targetConfig.host}`);
  console.log(`Port: ${targetConfig.port}`);
  console.log(`User: ${targetConfig.user}`);
  console.log(`Database: ${targetConfig.database}\n`);

  if (!targetConfig.host) {
    console.error('Error: Target DB_HOST is not set in backend/.env');
    rl.close();
    process.exit(1);
  }

  // Prompt for source configuration
  const sourceHost = (await askQuestion('Source DB Host [localhost]: ')) || 'localhost';
  const sourcePortStr = (await askQuestion('Source DB Port [3306]: ')) || '3306';
  const sourcePort = parseInt(sourcePortStr, 10);
  const sourceUser = (await askQuestion('Source DB User [root]: ')) || 'root';
  const sourcePassword = await askQuestion('Source DB Password (input will be visible): ');
  const sourceDatabase = (await askQuestion('Source DB Name [jobs]: ')) || 'jobs';

  rl.close();

  const sourceConfig = {
    host: sourceHost,
    port: sourcePort,
    user: sourceUser,
    password: sourcePassword,
    database: sourceDatabase
  };

  let sourceConn, targetConn;

  try {
    console.log('\nConnecting to source database...');
    sourceConn = await mysql.createConnection(sourceConfig);
    console.log('Connected to source database successfully!');

    console.log('Connecting to target database...');
    targetConn = await mysql.createConnection(targetConfig);
    console.log('Connected to target database successfully!');

    // Migrate tables: addjob, admin2
    const tablesToMigrate = ['addjob', 'admin2'];

    for (const tableName of tablesToMigrate) {
      console.log(`\nMigrating table: ${tableName}...`);

      // Check if table exists in source
      try {
        const [rows] = await sourceConn.execute(`SELECT * FROM ${tableName}`);
        console.log(`Found ${rows.length} rows in source table ${tableName}`);

        // Ensure table structure exists in target
        if (tableName === 'addjob') {
          await targetConn.execute(`
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
        } else if (tableName === 'admin2') {
          await targetConn.execute(`
            CREATE TABLE IF NOT EXISTS admin2 (
              id INT PRIMARY KEY,
              password VARCHAR(45)
            )
          `);
        }

        if (rows.length > 0) {
          // Clear target table to prevent duplicate primary keys
          console.log(`Clearing target table ${tableName} before inserting...`);
          await targetConn.execute(`TRUNCATE TABLE ${tableName}`);

          // Insert rows
          for (const row of rows) {
            const columns = Object.keys(row);
            const values = Object.values(row);
            const placeholders = columns.map(() => '?').join(', ');
            const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
            await targetConn.execute(query, values);
          }
          console.log(`Successfully migrated ${rows.length} rows to target table ${tableName}.`);
        } else {
          console.log(`No rows to migrate for table ${tableName}.`);
        }

      } catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log(`Table ${tableName} does not exist in source database. Skipping.`);
        } else {
          throw err;
        }
      }
    }

    // Ensure the view is created on the target database as well
    console.log('\nCreating/updating view_jobs on target database...');
    await targetConn.execute(`
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
    console.log('View view_jobs created/updated successfully!');

    console.log('\nMigration completed successfully!');

  } catch (error) {
    console.error('\nMigration failed with error:', error);
  } finally {
    if (sourceConn) await sourceConn.end();
    if (targetConn) await targetConn.end();
  }
}

main();
