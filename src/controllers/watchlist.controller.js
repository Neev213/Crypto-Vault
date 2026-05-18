import { Watchlist } from "../models/watchlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchSimplePrices, fetchMarketData, mapMarketCoin } from "../services/crypto.service.js";

export const getWatchlist = asyncHandler(async (req, res) => {
    const items = await Watchlist.find({ userId: req.user._id }).sort({ addedAt: -1 });
    const cryptoIds = items.map((i) => i.cryptoId);
    const prices = cryptoIds.length ? await fetchSimplePrices(cryptoIds) : {};

    const enriched = items.map((item) => ({
        ...item.toObject(),
        currentPrice: prices[item.cryptoId]?.usd ?? null,
        priceChange24h: prices[item.cryptoId]?.usd_24h_change ?? null,
        marketCap: prices[item.cryptoId]?.usd_market_cap ?? null,
    }));

    return res.status(200).json(
        new ApiResponse(200, enriched, "Watchlist fetched successfully")
    );
});

export const addToWatchlist = asyncHandler(async (req, res) => {
    const { cryptoId, coinName, symbol } = req.body;

    if (!cryptoId) {
        throw new ApiError(400, "cryptoId is required");
    }

    const existing = await Watchlist.findOne({ userId: req.user._id, cryptoId });
    if (existing) {
        throw new ApiError(409, "Coin is already in your watchlist");
    }

    let name = coinName;
    let coinSymbol = symbol;

    if (!name || !coinSymbol) {
        const market = await fetchMarketData({ ids: [cryptoId] });
        const coin = market[0];
        if (!coin) throw new ApiError(404, "Cryptocurrency not found");
        name = coin.name;
        coinSymbol = coin.symbol;
    }

    const item = await Watchlist.create({
        userId: req.user._id,
        cryptoId,
        coinName: name,
        symbol: coinSymbol?.toUpperCase(),
    });

    return res.status(201).json(
        new ApiResponse(201, item, "Added to watchlist successfully")
    );
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
    const { cryptoId } = req.params;

    const deleted = await Watchlist.findOneAndDelete({
        userId: req.user._id,
        cryptoId,
    });

    if (!deleted) {
        throw new ApiError(404, "Coin not found in watchlist");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Removed from watchlist successfully")
    );
});

export const getWatchlistMarkets = asyncHandler(async (req, res) => {
    const items = await Watchlist.find({ userId: req.user._id });
    const ids = items.map((i) => i.cryptoId);

    if (!ids.length) {
        return res.status(200).json(
            new ApiResponse(200, [], "Watchlist is empty")
        );
    }

    const market = await fetchMarketData({ ids });
    const data = market.map(mapMarketCoin);

    return res.status(200).json(
        new ApiResponse(200, data, "Watchlist market data fetched successfully")
    );
});
