const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnection");
const userRoutes = require("./routes/UserRoutes");


const app =  express()
dotenv.config();
connectDB()

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    console.log(req.method)
    res.json({name : "hello nodejs"})
})
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("server created✅")
})