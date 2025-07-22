import { Pool } from 'pg';
import { spawn } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Construct database URL
const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = process.env.POSTGRES_PORT || '5432';
const dbName = process.env.POSTGRES_DB || 'express_tutorial';
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'postgres';

const DATABASE_URL = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function runMigrations(): Promise<void> {
  return new Promise((resolve, reject) => {
    const migrateBin = path.resolve(__dirname, '../../node_modules/.bin/node-pg-migrate');
    const migrate = spawn(migrateBin, ['up'], {
      env: { ...process.env, DATABASE_URL },
      stdio: 'inherit',
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Migration failed with code ${code}`));
      }
    });

    migrate.on('error', (err) => {
      reject(err);
    });
  });
}

export async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
}

export async function getAllOrders() {
  const result = await pool.query(`
    SELECT orders.*, users.name as user_name, users.email as user_email 
    FROM orders 
    JOIN users ON orders.user_id = users.id 
    ORDER BY orders.created_at DESC
  `);
  return result.rows;
}

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
} 