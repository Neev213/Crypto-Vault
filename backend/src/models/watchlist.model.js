import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
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
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

watchlistSchema.index({ userId: 1 });
watchlistSchema.index({ userId: 1, cryptoId: 1 }, { unique: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);
