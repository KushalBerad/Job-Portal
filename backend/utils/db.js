import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host} 🔌`);
    } catch (error) {
        console.error("CRITICAL: Database connection failed! ❌", error.message);
        // Force the Node process to exit immediately if the database is down
        process.exit(1); 
    }
};

export default connectDB;
