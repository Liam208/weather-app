import express from "express";
import routes from "./routes/main.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./db/db.js";
import authRoutes from './routes/auth.routes.js'
import cookieParser from "cookie-parser";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'public', 'html'))

// Serve files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));


app.use("/", routes);
app.use("/", authRoutes);


connectDB()
  .then((result) => app.listen(3000, () => console.log("Server started on port 3000")))
  .catch((err) => console.log(err));
