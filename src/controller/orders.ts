import { getAllOrders, getAllUsers } from "../services/database";
import { Request, Response } from "express";

// HTML template function
const generateHTML = (users: any[], orders: any[]): string => `
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

    res.send(generateHTML(users, orders));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
};
