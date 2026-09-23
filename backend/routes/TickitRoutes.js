// routes/TicketRoutes.js
const express = require("express");
const router = express.Router();


const { 
    createTicket, 
    getMyTickets, 
    getTicketById, 
    updateTicket, 
    updateTicketStatus, 
    deleteTicket ,
     getAllTicketsForAdmin
} = require("../controllers/TickitController");


const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rolemiddleware");



// 1. Create Ticket
router.post("/", authenticate, authorize("employee", "admin"), createTicket);

// 2. Get My Tickets
router.get("/my-tickets", authenticate, authorize("employee", "admin"), getMyTickets);

router.get("/all", authenticate, authorize("admin"), getAllTicketsForAdmin);

// 3. Get Single Ticket
router.get("/:id", authenticate, authorize("employee", "admin"), getTicketById);

// 4. Edit Ticket Details
router.put("/:id", authenticate, authorize("employee", "admin"), updateTicket);

// 5. Change Ticket Status (Close/Reopen)
router.patch("/:id/status", authenticate, authorize("employee", "admin"), updateTicketStatus);



// 6. Delete Ticket (Soft Delete)
router.delete("/:id", authenticate, authorize("employee", "admin"), deleteTicket);

module.exports = router;