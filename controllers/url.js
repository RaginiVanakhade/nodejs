const { nanoid } = require('nanoid')
const URL = require('../models/url')

async function genrateUrl(req, res) {
    const body = req.body

    if (!body.url) {
        return res.status(400).json({
            error: 'url is required'
        })
    }

    const shortId = nanoid(8)

    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: []
    })

    return res.json({
        id: shortId
    })
}


async function getAnalastic(req, res) {
    const nanoid = req.params.nanoid
    const result = await URL.findOne({
        nanoid
    })
    return res.json({totalClicks : result.visitHistory.length,
        analytics : result.visitHistory
    })
}

module.exports = {
    genrateUrl,
    getAnalastic
}