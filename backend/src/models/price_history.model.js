import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
    cryptoId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    recordedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: false });

priceHistorySchema.index({ cryptoId: 1 });
priceHistorySchema.index({ cryptoId: 1, recordedAt: -1 });

export const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);
