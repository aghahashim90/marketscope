import { generatePDF } from '@/lib/pdfGenerator'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { symbol, assetData, analysis } = req.body

    if (!symbol || !assetData || !analysis) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pdfBuffer = await generatePDF(symbol, assetData, analysis)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${symbol}-analysis-report.pdf"`
    )
    res.status(200).send(pdfBuffer)
  } catch (error) {
    console.error('Error in /api/generate-pdf:', error)
    res.status(500).json({ error: error.message })
  }
}
