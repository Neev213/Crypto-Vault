import axios from "axios";
import { COINGECKO_BASE_URL, DEFAULT_CURRENCY } from "../constants.js";

const coingecko = axios.create({
    baseURL: COINGECKO_BASE_URL,
    timeout: 15000,
});

export const fetchMarketData = async ({
    page = 1,
    perPage = 50,
    ids = null,
    sparkline = false,
} = {}) => {
    const params = {
        vs_currency: DEFAULT_CURRENCY,
        order: "market_cap_desc",
        per_page: perPage,
        page,
        sparkline,
        price_change_percentage: "24h,7d",
    };

    if (ids?.length) {
        params.ids = Array.isArray(ids) ? ids.join(",") : ids;
        delete params.page;
        delete params.per_page;
    }

    const { data } = await coingecko.get("/coins/markets", { params });
    return data;
};

export const searchCoins = async (query) => {
    const { data } = await coingecko.get("/search", {
        params: { query },
    });
    return data.coins?.slice(0, 20) || [];
};

export const fetchCoinDetails = async (cryptoId) => {
    const { data } = await coingecko.get(`/coins/${cryptoId}`, {
        params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
        },
    });
    return data;
};

export const fetchTrendingCoins = async () => {
    const { data } = await coingecko.get("/search/trending");
    return data.coins?.map((item) => item.item) || [];
};

export const fetchSimplePrices = async (ids) => {
    if (!ids?.length) return {};

    const { data } = await coingecko.get("/simple/price", {
        params: {
            ids: ids.join(","),
            vs_currencies: DEFAULT_CURRENCY,
            include_24hr_change: true,
            include_market_cap: true,
        },
    });
    return data;
};

export const mapMarketCoin = (coin) => ({
    cryptoId: coin.id,
    symbol: coin.symbol?.toUpperCase(),
    name: coin.name,
    logoUrl: coin.image,
    currentPrice: coin.current_price,
    marketCap: coin.market_cap,
    priceChange24h: coin.price_change_percentage_24h,
    priceChange7d: coin.price_change_percentage_7d_in_currency,
    totalVolume: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
});
