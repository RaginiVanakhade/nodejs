const express = require("express")
const urlRoute = require("./routes/url")
const {connectToMongoDB} = require("./connection")

const app = express()
const PORT = 8000

app.use(express.json())

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(() => console.log("mongo connected❤️"))



app.use("/url", urlRoute)
app.listen(PORT, () => console.log(`server running on port http://localhost//${PORT}`))