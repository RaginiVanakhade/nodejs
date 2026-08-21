const express = require('express')
const {genrateUrl, getAnalastic} = require('../controllers/url')
const router = express.Router()


router.post('/', genrateUrl)

router.get('/analytics/:shortId',getAnalastic )


module.exports = router