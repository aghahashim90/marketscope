import axios from 'axios'

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

export async function getGoldData() {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'FX_DAILY',
        from_symbol: 'XAU',
        to_symbol: 'USD',
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    })

    const timeSeries = response.data['Time Series FX (Daily)']
    if (!timeSeries) {
      throw new Error('Invalid Alpha Vantage response')
    }

    const dates = Object.keys(timeSeries).slice(0, 30).reverse()
    const historicalPrices = dates.map((date) => ({
      date: new Date(date).toLocaleDateString(),
      price: parseFloat(timeSeries[date]['4. close']),
    }))

    const latestDate = Object.keys(timeSeries)[0]
    const previousDate = Object.keys(timeSeries)[1]
    const currentPrice = parseFloat(timeSeries[latestDate]['4. close'])
    const previousPrice = parseFloat(timeSeries[previousDate]['4. close'])
    const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100

    return {
      name: 'Gold (XAU/USD)',
      symbol: 'GOLD',
      currentPrice,
      percentageChange,
      historicalPrices,
    }
  } catch (error) {
    console.error('Alpha Vantage API Error:', error)
    throw new Error('Failed to fetch gold data')
  }
}
