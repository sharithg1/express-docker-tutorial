import express from 'express';
import { runMigrations, getAllUsers, getAllOrders, testConnection } from './services/database';
import dotenv from 'dotenv';
import { getAllOrdersController } from './controller/orders';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;



// Run migrations on startup
async function startServer() {
  try {
    // Test database connection first
    console.log('Testing database connection...');
    await testConnection();
    
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');

    app.get('/', getAllOrdersController);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log('Environment variables loaded:');
      console.log('- Database:', process.env.POSTGRES_DB || 'express_tutorial');
      console.log('- Host:', process.env.POSTGRES_HOST || 'localhost');
      console.log('- Port:', process.env.POSTGRES_PORT || '5432');
      console.log('- User:', process.env.POSTGRES_USER || 'postgres');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Please check your database configuration in .env file');
    process.exit(1);
  }
}

startServer();
