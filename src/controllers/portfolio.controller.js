import { Portfolio } from "../models/portfolio.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchSimplePrices } from "../services/crypto.service.js";
import { buildHoldingsWithPrices, analyzePortfolio } from "../utils/portfolioAnalytics.js";

const getOrCreatePortfolio = async (userId) => {
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
        portfolio = await Portfolio.create({
            userId,
            name: "My Portfolio",
            holdings: [],
        });
    }
    return portfolio;
};

export const getPortfolio = asyncHandler(async (req, res) => {
    const portfolio = await getOrCreatePortfolio(req.user._id);
    const coinIds = portfolio.holdings.map((h) => h.coinId);
    const prices = coinIds.length ? await fetchSimplePrices(coinIds) : {};
    const enrichedHoldings = buildHoldingsWithPrices(portfolio.holdings, prices);

    return res.status(200).json(
        new ApiResponse(200, {
            portfolio: {
                _id: portfolio._id,
                name: portfolio.name,
                description: portfolio.description,
                holdings: enrichedHoldings,
            },
            analysis: analyzePortfolio(enrichedHoldings),
        }, "Portfolio fetched successfully")
    );
});

export const updatePortfolioDetails = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name && description === undefined) {
        throw new ApiError(400, "At least one field (name or description) is required");
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updateFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(
        new ApiResponse(200, portfolio, "Portfolio updated successfully")
    );
});

export const addHolding = asyncHandler(async (req, res) => {
    const { coinId, coinName, symbol, quantity, buyPrice } = req.body;

    if (!coinId || !coinName || !symbol || quantity == null || buyPrice == null) {
        throw new ApiError(400, "coinId, coinName, symbol, quantity and buyPrice are required");
    }

    if (Number(quantity) <= 0 || Number(buyPrice) <= 0) {
        throw new ApiError(400, "quantity and buyPrice must be greater than 0");
    }

    const portfolio = await getOrCreatePortfolio(req.user._id);
    const existing = portfolio.holdings.find((h) => h.coinId === coinId);

    if (existing) {
        throw new ApiError(409, "This coin already exists in your portfolio. Use update holding instead.");
    }

    portfolio.holdings.push({
        coinId,
        coinName,
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
    });

    await portfolio.save();

    return res.status(201).json(
        new ApiResponse(201, portfolio, "Holding added successfully")
    );
});

export const updateHolding = asyncHandler(async (req, res) => {
    const { coinId } = req.params;
    const { quantity, buyPrice, coinName, symbol } = req.body;

    const portfolio = await getOrCreatePortfolio(req.user._id);
    const holding = portfolio.holdings.find((h) => h.coinId === coinId);

    if (!holding) {
        throw new ApiError(404, "Holding not found in portfolio");
    }

    if (quantity != null) {
        if (Number(quantity) <= 0) throw new ApiError(400, "quantity must be greater than 0");
        holding.quantity = Number(quantity);
    }
    if (buyPrice != null) {
        if (Number(buyPrice) <= 0) throw new ApiError(400, "buyPrice must be greater than 0");
        holding.buyPrice = Number(buyPrice);
    }
    if (coinName) holding.coinName = coinName;
    if (symbol) holding.symbol = symbol.toUpperCase();

    await portfolio.save();

    return res.status(200).json(
        new ApiResponse(200, portfolio, "Holding updated successfully")
    );
});

export const removeHolding = asyncHandler(async (req, res) => {
    const { coinId } = req.params;

    const portfolio = await getOrCreatePortfolio(req.user._id);
    const index = portfolio.holdings.findIndex((h) => h.coinId === coinId);

    if (index === -1) {
        throw new ApiError(404, "Holding not found in portfolio");
    }

    portfolio.holdings.splice(index, 1);
    await portfolio.save();

    return res.status(200).json(
        new ApiResponse(200, portfolio, "Holding removed successfully")
    );
});

export const getPortfolioAnalysis = asyncHandler(async (req, res) => {
    const portfolio = await getOrCreatePortfolio(req.user._id);
    const coinIds = portfolio.holdings.map((h) => h.coinId);
    const prices = coinIds.length ? await fetchSimplePrices(coinIds) : {};
    const enrichedHoldings = buildHoldingsWithPrices(portfolio.holdings, prices);
    const analysis = analyzePortfolio(enrichedHoldings);

    return res.status(200).json(
        new ApiResponse(200, analysis, "Portfolio analysis generated successfully")
    );
});
