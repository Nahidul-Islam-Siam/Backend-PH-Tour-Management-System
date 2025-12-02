/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Server } from "http"; // ✅ type-only import

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    console.log(envVars.NODE_ENV);

    await mongoose.connect(
    envVars.DB_URL
    );

    console.log("Connected to DB!!");

    server = app.listen(envVars.PORT, () => {
      console.log(
        `Server is running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();



 
