import express from 'express';
import { runMigrations, getAllUsers, getAllOrders, testConnection } from './services/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// HTML template function
const generateHTML = (users: any[], orders: any[]) => `
<!DOCTYPE html>
<html>
<head>
  <title>Database Data</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2 {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
    .status {
      padding: 5px 10px;
      border-radius: 4px;
      display: inline-block;
    }
    .completed { background-color: #e6ffe6; }
    .pending { background-color: #fff3e6; }
    .processing { background-color: #e6f3ff; }
  </style>
</head>
<body>
  <h1>Database Data</h1>
  
  <h2>Users</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      ${users.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(user.created_at).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Orders</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map(order => `
        <tr>
          <td>${order.id}</td>
          <td>${order.user_name} (${order.user_email})</td>
          <td>$${order.total_amount}</td>
          <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
`;

// Run migrations on startup
async function startServer() {
  try {
    // Test database connection first
    console.log('Testing database connection...');
    await testConnection();
    
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');

    app.get('/', async (req, res) => {
      try {
        const [users, orders] = await Promise.all([
          getAllUsers(),
          getAllOrders()
        ]);
        
        res.send(generateHTML(users, orders));
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
      }
    });

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
