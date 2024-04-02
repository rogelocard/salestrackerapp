const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    // saleId: {
    //     type: String
    // },
    timestamp: { // Timestamp of the sale
        type: Date,
        default: Date.now
    },
    flightNumber: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    barsetId: {
        type: String,
        required: true,
    },
    reportImage: { // Image from the tablet's report
        type: String,
        required: false,
    },
    total: {
        type: Number,
        required: true,
    },
})

const Sale = mongoose.model("Sale", salesSchema);

module.exports = Sale