const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    rawText: {
        type: String,
        required: true,
    },
    finalOutput: {
        type: mongoose.Schema.Types.Mixed, // Stores the final JSON object
    },
    status: {
        type: String,
        enum: ['processed', 'unprocessed'],
        required: true,
    },
    reason: { // Reason for unprocessed status
        type: String,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;