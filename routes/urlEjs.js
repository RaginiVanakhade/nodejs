const express = require('express')
const router = express.Router()
const {urlEjsController  }= require("../controllers/urlEjs")


router.get("/", urlEjsController )

module.exports = router