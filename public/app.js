async function fetchAllOrders() {
  try {
    const response = await fetch("/api/dashboard");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    renderAnalytics(data.analytics);
    renderUsers(data.users);
    renderOrders(data.orders);
  } catch (error) {
    console.error("Error fetching data:", error);
    renderError("Failed to load data. Please try again.");
  }
}

async function createOrder(orderData) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newOrder = await response.json();
    console.log("Order created:", newOrder);
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Handle form submission
async function handleCreateOrderForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const orderData = {
    user_id: parseInt(formData.get("user_id")),
    total_amount: parseFloat(formData.get("total_amount")),
    status: formData.get("status"),
  };

  try {
    await createOrder(orderData);

    // Refetch data to show the new order
    await fetchAllOrders();

    // Reset form
    e.target.reset();
  } catch (error) {
    renderError("Failed to create order. Please try again.");
  }
}

function renderAnalytics(analytics) {
  const analyticsDiv = document.getElementById("analytics");
  analyticsDiv.innerHTML = `
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
          .map(([status, count]) => `<p>${status}: ${count} orders</p>`)
          .join("")}
      </div>
      <div class="analytics-card">
        <h3>Daily Revenue</h3>
        ${analytics.dailyRevenue
          .map(
            (day) =>
              `<p>${day.date}: $${day.revenue.toFixed(2)} (${
                day.orderCount
              } orders)</p>`
          )
          .join("")}
      </div>
    </div>

    <h3>User Spending Patterns</h3>
    ${analytics.userSpendingPatterns
      .map(
        (user) => `
      <div class="analytics-card">
        <h4>${user.userName}</h4>
        <p>Total Spent: $${user.totalSpent.toFixed(2)}</p>
        <p>Order Count: ${user.orderCount}</p>
        <p>Average Order: $${user.averageOrderValue.toFixed(2)}</p>
        <div class="trend-chart">
          ${user.spendingTrend
            .map(
              (value) => `
            <div class="trend-bar" style="height: ${
              (value / Math.max(...user.spendingTrend)) * 100
            }%"></div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("")}
  `;
}

function renderUsers(users) {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = `
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
  `;
}

function renderOrders(orders) {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = `
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
  `;
}

function renderError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.textContent = message;
  document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Event listener for form submission
document
  .getElementById("createOrderForm")
  .addEventListener("submit", handleCreateOrderForm);

// Event listener to load data when page loads
document.addEventListener("DOMContentLoaded", fetchAllOrders);
