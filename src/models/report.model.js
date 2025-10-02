const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    rawText: {
        type: String,
        required: true,
    },
    finalOutput: {
        type: mongoose.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['processed', 'unprocessed'],
        required: true,
    },
    reason: {
        type: String,
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;