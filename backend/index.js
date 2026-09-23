const express = require("express")

const app =  express()

app.get("/", (req, res) => {
    console.log(req.method)
    res.json({name : "hello nodejs"})
})

app.listen(3001, () => {
    console.log("server created✅")
})