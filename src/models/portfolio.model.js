import mongoose from 'mongoose'; // import mongoose to create schema and model

// schema for each coin holding inside the portfolio
const holdingSchema = new mongoose.Schema({
  coinId:      { type: String, required: true }, // unique coin id from CoinGecko e.g. 'bitcoin'
  coinName:    { type: String, required: true }, // full name of coin e.g. 'Bitcoin'
  symbol:      { type: String, required: true }, // short symbol e.g. 'BTC'
  quantity:    { type: Number, required: true, min: 0 }, // how many coins the user holds
  avgBuyPrice: { type: Number, required: true }, // average price at which user bought this coin
}, { _id: false }); // disable _id for embedded subdocuments — not needed here

// schema for each buy or sell transaction inside the portfolio
const transactionSchema = new mongoose.Schema({
  coinId:       { type: String, required: true }, // coin id from CoinGecko e.g. 'bitcoin'
  coinName:     { type: String, required: true }, // full name of coin e.g. 'Bitcoin'
  symbol:       { type: String, required: true }, // short symbol e.g. 'BTC'
  type:         { type: String, enum: ['buy', 'sell'], required: true }, // transaction type — only buy or sell allowed
  quantity:     { type: Number, required: true }, // number of coins bought or sold
  pricePerUnit: { type: Number, required: true }, // price of one coin at time of transaction
  totalValue:   { type: Number, required: true }, // total value = quantity × pricePerUnit
  executedAt:   { type: Date, default: Date.now }, // timestamp of when transaction happened
}, { _id: false }); // disable _id for embedded subdocuments — not needed here

// main portfolio schema
const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // references the User collection
        ref: 'User', // tells mongoose this links to the User model
        required: true, // every portfolio must belong to a user
    },
        name:
        {
        type: String,
        default: 'My Portfolio'
        }, // portfolio name — default is 'My Portfolio'
        description:  
        {   type: String,
            default: ''
        }, // optional description for the portfolio
        holdings: 
        {   type: [holdingSchema],
            default: []
        }, // array of coin holdings — embedded inside portfolio
        transactions: 
        {   type: [transactionSchema],
            default: []
        }, // array of all buy/sell transactions — embedded inside portfolio
}, { timestamps: true }); // automatically add createdAt and updatedAt fields

portfolioSchema.index({ userId: 1 }); // index on userId for fast lookup of user's portfolio

export default mongoose.model('Portfolio', portfolioSchema); // export the Portfolio model