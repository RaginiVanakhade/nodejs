const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        // title काढून टाकला आहे
        description: { type: String, required: true }, // तक्रारीचं वर्णन
        
        softwareName: { type: String, required: true }, // सॉफ्टवेअरचं नाव (उदा. Zoom, VS Code)
        softwareIssueComment: { type: String, default: "" }, // सॉफ्टवेअरमधील नेमकी अडचण
        
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