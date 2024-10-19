import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import cors from "cors";
import stripeRoutes from "./routes/stripe.js";
const app=express();
dotenv.config();
const PORT = process.env.PORT || 5000;

(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, {});
      console.log('Database connected success');
    } 
    catch (error) {
      console.error('Database connection error:', error.message);
    }
  })();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/checkout",stripeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
