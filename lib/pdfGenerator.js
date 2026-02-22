import PDFDocument from 'pdfkit'

export function generatePDF(symbol, assetData, analysis) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Page 1 - Cover
      doc.fontSize(28).text('Market Analysis Summary', { align: 'center' })
      doc.moveDown()
      doc.fontSize(24).text(assetData.name, { align: 'center' })
      doc.moveDown()
      doc.fontSize(20).text(`$${assetData.currentPrice.toLocaleString()}`, {
        align: 'center',
      })
      doc.moveDown()
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, {
        align: 'center',
      })
      doc.moveDown(3)
      doc
        .fontSize(10)
        .text(
          'Disclaimer: This report is for informational purposes only and does not constitute financial advice.',
          { align: 'center' }
        )

      // Page 2 - Market Overview
      doc.addPage()
      doc.fontSize(18).text('Market Overview', { underline: true })
      doc.moveDown()
      doc.fontSize(12).text(`Asset: ${assetData.name}`)
      doc.text(`Current Price: $${assetData.currentPrice.toLocaleString()}`)
      doc.text(`24h Change: ${assetData.percentageChange.toFixed(2)}%`)
      doc.moveDown()
      doc.fontSize(14).text('Market Summary', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(11).text(analysis.marketSummary, { align: 'justify' })

      // Page 3 - Scenario Outlook
      doc.addPage()
      doc.fontSize(18).text('Scenario Outlook', { underline: true })
      doc.moveDown()

      doc.fontSize(14).fillColor('green').text('Bullish Scenario')
      doc.fillColor('black').fontSize(11).text(analysis.scenarios.bullish, {
        align: 'justify',
      })
      doc.moveDown()

      doc.fontSize(14).fillColor('red').text('Bearish Scenario')
      doc.fillColor('black').fontSize(11).text(analysis.scenarios.bearish, {
        align: 'justify',
      })
      doc.moveDown()

      doc.fontSize(14).fillColor('gray').text('Neutral Scenario')
      doc.fillColor('black').fontSize(11).text(analysis.scenarios.neutral, {
        align: 'justify',
      })
      doc.moveDown()

      doc.fontSize(14).text('Projection Range (3–5 Days)', { underline: true })
      doc.fontSize(11).text(analysis.scenarios.projection, { align: 'justify' })

      // Page 4 - Risk Factors
      doc.addPage()
      doc.fontSize(18).text('Risk Factors', { underline: true })
      doc.moveDown()
      doc.fontSize(11).text(analysis.riskFactors, { align: 'justify' })
      doc.moveDown(2)
      doc
        .fontSize(10)
        .text(
          'This analysis is based on historical data and market trends. Financial markets are subject to uncertainty and volatility. This report is for informational purposes only.',
          { align: 'justify' }
        )

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
