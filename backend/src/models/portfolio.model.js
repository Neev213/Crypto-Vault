import mongoose from 'mongoose'; // import mongoose to create schema and model

// schema for each coin holding inside the portfolio
const holdingSchema = new mongoose.Schema({
    coinId:   { type: String, required: true }, // coin id from coingecko e.g. 'bitcoin'
    coinName: { type: String, required: true }, // full name of coin e.g. 'Bitcoin'
    symbol:   { type: String, required: true }, // short symbol e.g. 'BTC'
    quantity: { type: Number, required: true, min: 0 }, // number of coins user holds
    buyPrice: { type: Number, required: true }, // price user paid — entered manually by user
    addedAt:  { type: Date, default: Date.now }, // date when user added this coin
}, { _id: false }); // no separate _id needed — embedded inside portfolio

// main portfolio schema
const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // references the User collection
        ref: 'User', // links to User model
        required: true, // every portfolio must belong to a user
    },
    name:        { type: String, default: 'My Portfolio' }, // portfolio name
    description: { type: String, default: '' }, // optional description
    holdings:    { type: [holdingSchema], default: [] }, // array of coins user is tracking
}, { timestamps: true }); // automatically add createdAt and updatedAt

portfolioSchema.index({ userId: 1 }, { unique: true });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema); // export as named export