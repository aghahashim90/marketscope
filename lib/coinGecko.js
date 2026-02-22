import axios from 'axios'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

export async function getCryptoData(coinId) {
  try {
    const [marketData, historyData] = await Promise.all([
      axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}`),
      axios.get(
        `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=30`
      ),
    ])

    const coin = marketData.data
    const prices = historyData.data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: price,
    }))

    return {
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.market_data.current_price.usd,
      percentageChange: coin.market_data.price_change_percentage_24h,
      marketCap: coin.market_data.market_cap.usd,
      volume: coin.market_data.total_volume.usd,
      historicalPrices: prices,
    }
  } catch (error) {
    console.error('CoinGecko API Error:', error)
    throw new Error('Failed to fetch crypto data')
  }
}
