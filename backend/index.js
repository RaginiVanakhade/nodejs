const express = require('express')


const app = express()

app.get("/", (req, res) => {
    console.log("hello nodejs")
    res.json({title : "hello nodejs server is created"})
})


app.listen(3001,() => {
    console.log("server is created")
})