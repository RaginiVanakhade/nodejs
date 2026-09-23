const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnection");

dotenv.config();
const app =  express()
connectDB()

app.get("/", (req, res) => {
    console.log(req.method)
    res.json({name : "hello nodejs"})
})

app.listen(3001, () => {
    console.log("server created✅")
})