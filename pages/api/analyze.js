import { generateAnalysis } from '@/lib/openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { symbol, assetData } = req.body

    if (!symbol || !assetData) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const analysis = await generateAnalysis(symbol, assetData)
    res.status(200).json(analysis)
  } catch (error) {
    console.error('Error in /api/analyze:', error)
    res.status(500).json({ error: error.message })
  }
}
