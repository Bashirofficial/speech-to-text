import dotenv from "dotenv";
import prisma from "./src/db/index.js"; // Import the Prisma client
import { app } from "./app.js";

dotenv.config();
async function connectAndStart() {
  try {
    await prisma.$connect();
    console.log("Prisma connected to database successfully.");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port: ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Prisma database connection failed:", error);
    process.exit(1); // Exit if database connection fails
  }
}

connectAndStart();
