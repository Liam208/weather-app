import mongoose from "mongoose";

const dbURI = "mongodb://localhost:27017/test";


async function connectDB(){
   await  mongoose.connect(dbURI);
}

export default connectDB;