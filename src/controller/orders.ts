import { getAllOrders, getAllUsers } from "../services/database";
import { analyzeOrders } from "../services/analytics";
import { Request, Response } from "express";

// HTML template function
const generateHTML = (users: any[], orders: any[], analytics: any): string => `
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
    .analytics {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .analytics-card {
      background: white;
      padding: 15px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .analytics-card h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    .trend-chart {
      height: 50px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
    }
    .trend-bar {
      flex: 1;
      background: #3498db;
      min-height: 1px;
    }
  </style>
</head>
<body>
  <h1>Database Data</h1>

  <div class="analytics">
    <h2>Analytics Dashboard</h2>
    <div class="analytics-grid">
      <div class="analytics-card">
        <h3>Revenue Overview</h3>
        <p>Total Revenue: $${analytics.totalRevenue.toFixed(2)}</p>
        <p>Average Order Value: $${analytics.averageOrderValue.toFixed(2)}</p>
      </div>
      <div class="analytics-card">
        <h3>Order Status Distribution</h3>
        ${Object.entries(analytics.statusDistribution)
          .map(([status, count]) => `
            <p>${status}: ${count} orders</p>
          `).join('')}
      </div>
      <div class="analytics-card">
        <h3>Daily Revenue</h3>
        ${analytics.dailyRevenue.map((day: any) => `
          <p>${day.date}: $${day.revenue.toFixed(2)} (${day.orderCount} orders)</p>
        `).join('')}
      </div>
    </div>

    <h3>User Spending Patterns</h3>
    ${analytics.userSpendingPatterns.map((user: any) => `
      <div class="analytics-card">
        <h4>${user.userName}</h4>
        <p>Total Spent: $${user.totalSpent.toFixed(2)}</p>
        <p>Order Count: ${user.orderCount}</p>
        <p>Average Order: $${user.averageOrderValue.toFixed(2)}</p>
        <div class="trend-chart">
          ${user.spendingTrend.map((value: number) => `
            <div class="trend-bar" style="height: ${(value / Math.max(...user.spendingTrend) * 100)}%"></div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>
  
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
      ${users
        .map(
          (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(user.created_at).toLocaleString()}</td>
        </tr>
      `
        )
        .join("")}
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
      ${orders
        .map(
          (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.user_name} (${order.user_email})</td>
          <td>$${order.total_amount}</td>
          <td><span class="status ${order.status.toLowerCase()}">${
            order.status
          }</span></td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
`;

export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const [users, orders] = await Promise.all([getAllUsers(), getAllOrders()]);
    
    // Perform CPU-intensive analytics
    const analytics = analyzeOrders(orders, users);

    res.send(generateHTML(users, orders, analytics));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
};
