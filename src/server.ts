/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Server } from "http"; // ✅ type-only import

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;


const startServer = async () => {
  try {

    console.log(envVars.NODE_ENV);
    
    await mongoose.connect("mongodb+srv://tour-management:UL9NNGTjgnnV0Znx@cluster0.ta90r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    console.log("Connected to DB!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
};

startServer();



