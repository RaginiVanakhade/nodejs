const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rolemiddleware");

const router = express.Router();

router.post(
    "/ticket",
    authenticate,
    authorize("employee"),
    createTicket
);

router.get(
    "/users",
    authenticate,
    authorize("admin"),
    getUsers
);

module.exports = router;