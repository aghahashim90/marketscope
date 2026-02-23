import { getGoldData } from '../../lib/alphaVantage'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = await getGoldData()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in /api/gold:', error)
    res.status(500).json({ error: error.message })
  }
}
