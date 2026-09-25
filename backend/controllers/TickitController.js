const Ticket = require("../modules/Tickitmodule"); 

// 1. Create Ticket 
const createTicket = async (req, res) => {
    try {
        // title 
        const {  category, priority, softwareName, softwareIssueComment, remark } = req.body;

        const newTicket = await Ticket.create({
            
            category,
            priority,
            softwareName,          
            softwareIssueComment,
            remark,
            createdBy: req.user.userId 
        });

        res.status(201).json({
            message: "Ticket raised successfully",
            ticket: newTicket
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get My Tickets 
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ 
            createdBy: req.user.userId,
            isDeleted: false 
        }).sort({ createdAt: -1 });

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Single Ticket
const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket || ticket.isDeleted) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. This is not your ticket." });
        }

        res.status(200).json({ ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update Ticket 
const updateTicket = async (req, res) => {
    try {

        const {  category, priority, softwareName, softwareIssueComment, remark } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket || ticket.isDeleted) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (ticket.status === "CLOSED" || ticket.status === "RESOLVED") {
            return res.status(400).json({ message: "Cannot edit a resolved or closed ticket" });
        }

       

        ticket.category = category || ticket.category;
        ticket.priority = priority || ticket.priority;
        ticket.softwareName = softwareName || ticket.softwareName;                      
        ticket.softwareIssueComment = softwareIssueComment || ticket.softwareIssueComment;
        ticket.remark = remark !== undefined ? remark : ticket.remark;

        const updatedTicket = await ticket.save();

        res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Change Ticket Status 
const updateTicketStatus = async (req, res) => {
    try {
        const { status, closeComment, remark } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket || ticket.isDeleted) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = ticket.createdBy.toString() === req.user.userId;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (status !== "CLOSED" && status !== "OPEN") {
            return res.status(400).json({ 
                message: "User can only CLOSE or REOPEN a ticket. Other statuses are managed by support." 
            });
        }

        const adminRemark = (remark ?? closeComment ?? "").trim();

        if (status === "CLOSED" && !adminRemark) {
            return res.status(400).json({
                message: "A closing comment is required before a ticket can be marked as closed."
            });
        }

        ticket.status = status;
        ticket.closeComment = status === "CLOSED" ? (closeComment || adminRemark).trim() : "";
        ticket.remark = adminRemark || ticket.remark;
        await ticket.save();

        res.status(200).json({
            message: `Ticket status changed to ${status}`,
            ticket
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Delete Ticket 
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket || ticket.isDeleted) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (ticket.status !== "OPEN") {
            return res.status(400).json({ message: "You can only delete an OPEN ticket" });
        }

        ticket.isDeleted = true;
        await ticket.save();

        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTicketsForAdmin = async (req, res) => {
    try {
     
        const tickets = await Ticket.find({ isDeleted: false })
            .populate("createdBy", "name email role") 
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            message: "All tickets fetched successfully",
            totalTickets: tickets.length, 
            tickets 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getTicketById,
    updateTicket,
    updateTicketStatus,
    deleteTicket,
    getAllTicketsForAdmin
};