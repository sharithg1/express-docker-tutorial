import express from "express";
import { runMigrations, testConnection } from "./services/database";
import dotenv from "dotenv";
import {
  getAllOrdersController,
  createOrderController,
  getAllOrdersControllerJson,
} from "./controller/orders";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // Be more restrictive in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = process.env.PORT || 3001;

// Run migrations on startup
async function startServer() {
  try {
    // Test database connection first
    console.log("Testing database connection...");
    await testConnection();

    console.log("Running database migrations...");
    await runMigrations();
    console.log("Migrations completed successfully");

    // Express will serve public/index.html for all routes rather than the HTML from server at that route
    app.use(express.static("public"));

    // Parses incoming JSON request bodies, createOrderController needs to read JSON data from form submissions
    app.use(express.json());

    // Routes
    app.get("/", getAllOrdersController);
    app.get("/api/dashboard", getAllOrdersControllerJson);
    app.post("/api/orders", createOrderController);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log("Environment variables loaded:");
      console.log("- Database:", process.env.POSTGRES_DB || "express_tutorial");
      console.log("- Host:", process.env.POSTGRES_HOST || "localhost");
      console.log("- Port:", process.env.POSTGRES_PORT || "5432");
      console.log("- User:", process.env.POSTGRES_USER || "postgres");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    console.error("Please check your database configuration in .env file");
    process.exit(1);
  }
}

startServer();
