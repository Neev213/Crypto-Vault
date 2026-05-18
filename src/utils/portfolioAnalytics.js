import { RISK_LEVELS, RISK_THRESHOLDS } from "../constants.js";

export const buildHoldingsWithPrices = (holdings, priceMap) => {
    return holdings.map((holding) => {
        const live = priceMap[holding.coinId] || {};
        const currentPrice = live.usd ?? 0;
        const invested = holding.quantity * holding.buyPrice;
        const currentValue = holding.quantity * currentPrice;
        const profitLoss = currentValue - invested;
        const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

        return {
            ...holding.toObject?.() ?? holding,
            currentPrice,
            invested,
            currentValue,
            profitLoss,
            profitLossPercent,
            priceChange24h: live.usd_24h_change ?? null,
        };
    });
};

export const analyzePortfolio = (enrichedHoldings) => {
    const totalInvested = enrichedHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalCurrentValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalProfitLossPercent =
        totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    const allocation = enrichedHoldings.map((h) => ({
        coinId: h.coinId,
        coinName: h.coinName,
        symbol: h.symbol,
        percentage: totalCurrentValue > 0 ? (h.currentValue / totalCurrentValue) * 100 : 0,
        currentValue: h.currentValue,
    }));

    const avgVolatility =
        enrichedHoldings.length > 0
            ? enrichedHoldings.reduce(
                  (sum, h) => sum + Math.abs(h.priceChange24h ?? 0),
                  0
              ) / enrichedHoldings.length
            : 0;

    let riskLevel = RISK_LEVELS.MEDIUM;
    if (avgVolatility <= RISK_THRESHOLDS.lowVolatility) riskLevel = RISK_LEVELS.LOW;
    else if (avgVolatility >= RISK_THRESHOLDS.highVolatility) riskLevel = RISK_LEVELS.HIGH;

    const topGainer = [...enrichedHoldings].sort(
        (a, b) => b.profitLossPercent - a.profitLossPercent
    )[0];
    const topLoser = [...enrichedHoldings].sort(
        (a, b) => a.profitLossPercent - b.profitLossPercent
    )[0];

    return {
        summary: {
            totalInvested,
            totalCurrentValue,
            totalProfitLoss,
            totalProfitLossPercent,
            holdingsCount: enrichedHoldings.length,
            riskLevel,
            avgVolatility24h: Number(avgVolatility.toFixed(2)),
        },
        allocation,
        topGainer: topGainer || null,
        topLoser: topLoser || null,
        suggestions: buildSuggestions(totalProfitLossPercent, riskLevel, allocation),
    };
};

const buildSuggestions = (totalPnlPercent, riskLevel, allocation) => {
    const suggestions = [];

    if (allocation.length === 1) {
        suggestions.push({
            type: "diversification",
            message: "Your portfolio is concentrated in a single asset. Consider diversifying across multiple cryptocurrencies.",
        });
    }

    const dominant = allocation.find((a) => a.percentage > 60);
    if (dominant) {
        suggestions.push({
            type: "rebalance",
            message: `${dominant.coinName} makes up ${dominant.percentage.toFixed(1)}% of your portfolio. Rebalancing may reduce concentration risk.`,
        });
    }

    if (riskLevel === RISK_LEVELS.HIGH) {
        suggestions.push({
            type: "risk",
            message: "High 24h volatility detected. Consider stablecoins or large-cap assets if you prefer lower risk.",
        });
    }

    if (totalPnlPercent < -15) {
        suggestions.push({
            type: "performance",
            message: "Portfolio is down significantly. Review your cost basis and consider dollar-cost averaging rather than panic selling.",
        });
    } else if (totalPnlPercent > 25) {
        suggestions.push({
            type: "performance",
            message: "Strong gains detected. Consider taking partial profits or setting price alerts to protect returns.",
        });
    }

    if (!suggestions.length) {
        suggestions.push({
            type: "general",
            message: "Portfolio looks balanced. Keep tracking prices and set alerts for your target levels.",
        });
    }

    return suggestions;
};
