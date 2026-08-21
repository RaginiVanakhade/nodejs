const express = require('express')
const {genrateUrl} = require('../controllers/url')
const router = express.Router()


router.post('/', genrateUrl)


module.exports = router