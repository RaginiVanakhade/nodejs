const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
       
        description: { type: String, required: true }, 
        
        softwareName: { type: String, required: true }, 
        softwareIssueComment: { type: String, default: "" }, 
        
        category: { type: String, default: "General" },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "LOW"
        },
        status: {
            type: String,
            enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
            default: "OPEN"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);