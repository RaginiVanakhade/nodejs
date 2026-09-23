const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnection");
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/TickitRoutes")


const app =  express()
dotenv.config();
connectDB()

// Middleware
app.use(express.json());

// routes 
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("server created✅")
})