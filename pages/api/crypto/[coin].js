import { getCryptoData } from '@/lib/coinGecko'

export default async function handler(req, res) {
  const { coin } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = await getCryptoData(coin)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in /api/crypto/[coin]:', error)
    res.status(500).json({ error: error.message })
  }
}
