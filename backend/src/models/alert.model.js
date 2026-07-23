import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cryptoId: {
        type: String,
        required: true,
    },
    coinName: {
        type: String,
        default: "",
    },
    symbol: {
        type: String,
        default: "",
    },
    targetPrice: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        enum: ["above", "below"],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

alertSchema.index({ userId: 1 });
alertSchema.index({ isActive: 1 });

export const Alert = mongoose.model("Alert", alertSchema);
