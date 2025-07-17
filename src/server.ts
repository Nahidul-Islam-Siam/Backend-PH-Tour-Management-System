import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect("mongodb+srv://tour-management:UL9NNGTjgnnV0Znx@cluster0.ta90r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    console.log("Connected to DB!!");

    server = app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
};

startServer();



