import { Alert } from "../models/alert.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchSimplePrices } from "../services/crypto.service.js";

export const getAlerts = asyncHandler(async (req, res) => {
    const filter = { userId: req.user._id };
    if (req.query.active === "true") filter.isActive = true;

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    const cryptoIds = [...new Set(alerts.map((a) => a.cryptoId))];
    const prices = cryptoIds.length ? await fetchSimplePrices(cryptoIds) : {};

    const enriched = alerts.map((alert) => {
        const currentPrice = prices[alert.cryptoId]?.usd ?? null;
        let triggered = false;

        if (currentPrice != null && alert.isActive) {
            triggered =
                alert.condition === "above"
                    ? currentPrice >= alert.targetPrice
                    : currentPrice <= alert.targetPrice;
        }

        return {
            ...alert.toObject(),
            currentPrice,
            triggered,
        };
    });

    return res.status(200).json(
        new ApiResponse(200, enriched, "Alerts fetched successfully")
    );
});

export const createAlert = asyncHandler(async (req, res) => {
    const { cryptoId, targetPrice, condition, coinName, symbol } = req.body;

    if (!cryptoId || targetPrice == null || !condition) {
        throw new ApiError(400, "cryptoId, targetPrice and condition are required");
    }

    if (!["above", "below"].includes(condition)) {
        throw new ApiError(400, "condition must be 'above' or 'below'");
    }

    if (Number(targetPrice) <= 0) {
        throw new ApiError(400, "targetPrice must be greater than 0");
    }

    const alert = await Alert.create({
        userId: req.user._id,
        cryptoId,
        targetPrice: Number(targetPrice),
        condition,
        coinName: coinName || "",
        symbol: symbol?.toUpperCase() || "",
        isActive: true,
    });

    return res.status(201).json(
        new ApiResponse(201, alert, "Price alert created successfully")
    );
});

export const updateAlert = asyncHandler(async (req, res) => {
    const { alertId } = req.params;
    const { targetPrice, condition, isActive } = req.body;

    const updateFields = {};
    if (targetPrice != null) {
        if (Number(targetPrice) <= 0) throw new ApiError(400, "targetPrice must be greater than 0");
        updateFields.targetPrice = Number(targetPrice);
    }
    if (condition) {
        if (!["above", "below"].includes(condition)) {
            throw new ApiError(400, "condition must be 'above' or 'below'");
        }
        updateFields.condition = condition;
    }
    if (isActive !== undefined) updateFields.isActive = isActive;

    if (!Object.keys(updateFields).length) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const alert = await Alert.findOneAndUpdate(
        { _id: alertId, userId: req.user._id },
        { $set: updateFields },
        { new: true }
    );

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    return res.status(200).json(
        new ApiResponse(200, alert, "Alert updated successfully")
    );
});

export const deleteAlert = asyncHandler(async (req, res) => {
    const { alertId } = req.params;

    const alert = await Alert.findOneAndDelete({
        _id: alertId,
        userId: req.user._id,
    });

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Alert deleted successfully")
    );
});

export const checkTriggeredAlerts = asyncHandler(async (req, res) => {
    const alerts = await Alert.find({ userId: req.user._id, isActive: true });
    const cryptoIds = [...new Set(alerts.map((a) => a.cryptoId))];
    const prices = cryptoIds.length ? await fetchSimplePrices(cryptoIds) : {};

    const triggered = alerts.filter((alert) => {
        const currentPrice = prices[alert.cryptoId]?.usd;
        if (currentPrice == null) return false;
        return alert.condition === "above"
            ? currentPrice >= alert.targetPrice
            : currentPrice <= alert.targetPrice;
    });

    return res.status(200).json(
        new ApiResponse(200, triggered, "Triggered alerts fetched successfully")
    );
});
