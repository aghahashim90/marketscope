import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generatePDF(symbol, assetData, analysis) {
  const pdfDoc = await PDFDocument.create()

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const black = rgb(0.07, 0.07, 0.07)
  const gray = rgb(0.4, 0.4, 0.4)
  const lightGray = rgb(0.95, 0.95, 0.95)
  const blue = rgb(0.18, 0.42, 0.78)
  const green = rgb(0.1, 0.55, 0.25)
  const red = rgb(0.75, 0.1, 0.1)
  const white = rgb(1, 1, 1)

  const pageWidth = 595
  const pageHeight = 842
  const margin = 50

  function wrapText(text, font, fontSize, maxWidth) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = font.widthOfTextAtSize(testLine, fontSize)
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines
  }

  function drawWrappedText(page, text, x, y, font, fontSize, color, maxWidth, lineHeight) {
    const lines = wrapText(text || '', font, fontSize, maxWidth)
    let currentY = y
    for (const line of lines) {
      if (currentY < margin) break
      page.drawText(line, { x, y: currentY, size: fontSize, font, color })
      currentY -= lineHeight
    }
    return currentY
  }

  function drawDivider(page, y) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
  }

  // ─────────────────────────────────────────────
  // PAGE 1 — COVER
  // ─────────────────────────────────────────────
  const page1 = pdfDoc.addPage([pageWidth, pageHeight])

  // Top header bar
  page1.drawRectangle({
    x: 0,
    y: pageHeight - 80,
    width: pageWidth,
    height: 80,
    color: blue,
  })

  page1.drawText('MarketScope', {
    x: margin,
    y: pageHeight - 45,
    size: 22,
    font: fontBold,
    color: white,
  })

  page1.drawText('Financial Analysis Platform  |  Free Beta', {
    x: margin,
    y: pageHeight - 65,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.88, 1),
  })

  // Center content
  const centerX = pageWidth / 2
  page1.drawText('Market Analysis Summary', {
    x: centerX - fontBold.widthOfTextAtSize('Market Analysis Summary', 26) / 2,
    y: 640,
    size: 26,
    font: fontBold,
    color: black,
  })

  drawDivider(page1, 620)

  page1.drawText(assetData.name, {
    x: centerX - fontBold.widthOfTextAtSize(assetData.name, 32) / 2,
    y: 580,
    size: 32,
    font: fontBold,
    color: blue,
  })

  const priceText = `$${assetData.currentPrice.toLocaleString()}`
  page1.drawText(priceText, {
    x: centerX - fontBold.widthOfTextAtSize(priceText, 28) / 2,
    y: 535,
    size: 28,
    font: fontBold,
    color: black,
  })

  const changeColor = assetData.percentageChange >= 0 ? green : red
  const changePrefix = assetData.percentageChange >= 0 ? '+' : ''
  const changeText = `${changePrefix}${assetData.percentageChange.toFixed(2)}% (24h)`
  page1.drawText(changeText, {
    x: centerX - fontBold.widthOfTextAtSize(changeText, 16) / 2,
    y: 505,
    size: 16,
    font: fontBold,
    color: changeColor,
  })

  drawDivider(page1, 480)

  const dateText = `Report Generated: ${new Date().toUTCString()}`
  page1.drawText(dateText, {
    x: centerX - fontRegular.widthOfTextAtSize(dateText, 11) / 2,
    y: 455,
    size: 11,
    font: fontRegular,
    color: gray,
  })

  page1.drawText(`Asset Symbol: ${assetData.symbol || symbol.toUpperCase()}`, {
    x: centerX - fontRegular.widthOfTextAtSize(`Asset Symbol: ${assetData.symbol || symbol.toUpperCase()}`, 11) / 2,
    y: 435,
    size: 11,
    font: fontRegular,
    color: gray,
  })

  // Disclaimer box
  page1.drawRectangle({
    x: margin,
    y: 100,
    width: pageWidth - margin * 2,
    height: 60,
    color: lightGray,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  page1.drawText('DISCLAIMER', {
    x: margin + 12,
    y: 145,
    size: 9,
    font: fontBold,
    color: gray,
  })

  const disclaimer = 'This report is for informational purposes only and does not constitute financial advice,'
  const disclaimer2 = 'investment recommendations, or guarantees of any kind.'
  page1.drawText(disclaimer, { x: margin + 12, y: 130, size: 8, font: fontRegular, color: gray })
  page1.drawText(disclaimer2, { x: margin + 12, y: 118, size: 8, font: fontRegular, color: gray })

  // Bottom footer
  page1.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 35, color: rgb(0.95, 0.95, 0.95) })
  page1.drawText('Page 1 of 4', {
    x: centerX - fontRegular.widthOfTextAtSize('Page 1 of 4', 9) / 2,
    y: 12,
    size: 9,
    font: fontRegular,
    color: gray,
  })

  // ─────────────────────────────────────────────
  // PAGE 2 — MARKET OVERVIEW
  // ─────────────────────────────────────────────
  const page2 = pdfDoc.addPage([pageWidth, pageHeight])

  page2.drawRectangle({ x: 0, y: pageHeight - 55, width: pageWidth, height: 55, color: blue })
  page2.drawText('Market Overview', {
    x: margin,
    y: pageHeight - 35,
    size: 18,
    font: fontBold,
    color: white,
  })

  // Stats section
  let y2 = pageHeight - 90

  page2.drawText('Asset Information', { x: margin, y: y2, size: 13, font: fontBold, color: blue })
  y2 -= 20

  drawDivider(page2, y2)
  y2 -= 15

  const stats = [
    ['Asset Name', assetData.name],
    ['Current Price', `$${assetData.currentPrice.toLocaleString()}`],
    ['24h Change', `${changePrefix}${assetData.percentageChange.toFixed(2)}%`],
    ['Data Points', `${assetData.historicalPrices.length} days of historical data`],
  ]

  for (const [label, value] of stats) {
    page2.drawText(`${label}:`, { x: margin, y: y2, size: 11, font: fontBold, color: black })
    page2.drawText(value, { x: margin + 160, y: y2, size: 11, font: fontRegular, color: gray })
    y2 -= 22
  }

  y2 -= 10
  drawDivider(page2, y2)
  y2 -= 20

  page2.drawText('Market Summary', { x: margin, y: y2, size: 13, font: fontBold, color: blue })
  y2 -= 20

  y2 = drawWrappedText(page2, analysis.marketSummary, margin, y2, fontRegular, 11, black, pageWidth - margin * 2, 18)

  y2 -= 20
  drawDivider(page2, y2)
  y2 -= 20

  page2.drawText('Trend Analysis', { x: margin, y: y2, size: 13, font: fontBold, color: blue })
  y2 -= 20

  const trendText = assetData.percentageChange >= 0
    ? `${assetData.name} is showing a positive momentum with a ${changePrefix}${assetData.percentageChange.toFixed(2)}% change over the past 24 hours. The 30-day price data reflects the current market trend.`
    : `${assetData.name} is showing a negative momentum with a ${assetData.percentageChange.toFixed(2)}% change over the past 24 hours. The 30-day price data reflects the current market trend.`

  drawWrappedText(page2, trendText, margin, y2, fontRegular, 11, black, pageWidth - margin * 2, 18)

  page2.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 35, color: rgb(0.95, 0.95, 0.95) })
  page2.drawText('Page 2 of 4', {
    x: pageWidth / 2 - fontRegular.widthOfTextAtSize('Page 2 of 4', 9) / 2,
    y: 12,
    size: 9,
    font: fontRegular,
    color: gray,
  })

  // ─────────────────────────────────────────────
  // PAGE 3 — SCENARIO OUTLOOK
  // ─────────────────────────────────────────────
  const page3 = pdfDoc.addPage([pageWidth, pageHeight])

  page3.drawRectangle({ x: 0, y: pageHeight - 55, width: pageWidth, height: 55, color: blue })
  page3.drawText('Scenario Outlook', {
    x: margin,
    y: pageHeight - 35,
    size: 18,
    font: fontBold,
    color: white,
  })

  let y3 = pageHeight - 90

  // Bullish
  page3.drawRectangle({ x: margin, y: y3 - 5, width: 8, height: 20, color: green })
  page3.drawText('Bullish Scenario', { x: margin + 16, y: y3, size: 13, font: fontBold, color: green })
  y3 -= 22
  y3 = drawWrappedText(page3, analysis.scenarios.bullish, margin, y3, fontRegular, 11, black, pageWidth - margin * 2, 18)
  y3 -= 15
  drawDivider(page3, y3)
  y3 -= 20

  // Bearish
  page3.drawRectangle({ x: margin, y: y3 - 5, width: 8, height: 20, color: red })
  page3.drawText('Bearish Scenario', { x: margin + 16, y: y3, size: 13, font: fontBold, color: red })
  y3 -= 22
  y3 = drawWrappedText(page3, analysis.scenarios.bearish, margin, y3, fontRegular, 11, black, pageWidth - margin * 2, 18)
  y3 -= 15
  drawDivider(page3, y3)
  y3 -= 20

  // Neutral
  page3.drawRectangle({ x: margin, y: y3 - 5, width: 8, height: 20, color: gray })
  page3.drawText('Neutral Scenario', { x: margin + 16, y: y3, size: 13, font: fontBold, color: gray })
  y3 -= 22
  y3 = drawWrappedText(page3, analysis.scenarios.neutral, margin, y3, fontRegular, 11, black, pageWidth - margin * 2, 18)
  y3 -= 15
  drawDivider(page3, y3)
  y3 -= 20

  // Projection Box
  page3.drawRectangle({
    x: margin,
    y: y3 - 80,
    width: pageWidth - margin * 2,
    height: 90,
    color: rgb(0.92, 0.95, 1),
    borderColor: blue,
    borderWidth: 1,
  })

  page3.drawText('Projection Range (3–5 Days)', {
    x: margin + 12,
    y: y3 - 15,
    size: 13,
    font: fontBold,
    color: blue,
  })

  drawWrappedText(page3, analysis.scenarios.projection, margin + 12, y3 - 35, fontRegular, 11, black, pageWidth - margin * 2 - 24, 18)

  page3.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 35, color: rgb(0.95, 0.95, 0.95) })
  page3.drawText('Page 3 of 4', {
    x: pageWidth / 2 - fontRegular.widthOfTextAtSize('Page 3 of 4', 9) / 2,
    y: 12,
    size: 9,
    font: fontRegular,
    color: gray,
  })

  // ─────────────────────────────────────────────
  // PAGE 4 — RISK FACTORS
  // ─────────────────────────────────────────────
  const page4 = pdfDoc.addPage([pageWidth, pageHeight])

  page4.drawRectangle({ x: 0, y: pageHeight - 55, width: pageWidth, height: 55, color: blue })
  page4.drawText('Risk Factors', {
    x: margin,
    y: pageHeight - 35,
    size: 18,
    font: fontBold,
    color: white,
  })

  let y4 = pageHeight - 90

  page4.drawText('Risk Analysis', { x: margin, y: y4, size: 13, font: fontBold, color: blue })
  y4 -= 20
  drawDivider(page4, y4)
  y4 -= 20

  y4 = drawWrappedText(page4, analysis.riskFactors, margin, y4, fontRegular, 11, black, pageWidth - margin * 2, 18)

  y4 -= 30
  drawDivider(page4, y4)
  y4 -= 20

  page4.drawText('Market Uncertainty Notes', { x: margin, y: y4, size: 13, font: fontBold, color: blue })
  y4 -= 20

  const uncertaintyText = 'Financial markets are inherently unpredictable. Past performance does not guarantee future results. Market conditions can change rapidly due to macroeconomic events, regulatory changes, geopolitical developments, and investor sentiment shifts. All analysis presented in this report is based on publicly available data and should be independently verified before making any decisions.'
  y4 = drawWrappedText(page4, uncertaintyText, margin, y4, fontRegular, 11, black, pageWidth - margin * 2, 18)

  // Footer box
  page4.drawRectangle({
    x: margin,
    y: 60,
    width: pageWidth - margin * 2,
    height: 55,
    color: lightGray,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  page4.drawText('INFORMATIONAL PURPOSE ONLY', {
    x: margin + 12,
    y: 100,
    size: 9,
    font: fontBold,
    color: gray,
  })

  page4.drawText('This report was generated by MarketScope for educational and informational purposes only.', {
    x: margin + 12,
    y: 85,
    size: 8,
    font: fontRegular,
    color: gray,
  })

  page4.drawText('It does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.', {
    x: margin + 12,
    y: 73,
    size: 8,
    font: fontRegular,
    color: gray,
  })

  page4.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 35, color: rgb(0.95, 0.95, 0.95) })
  page4.drawText('Page 4 of 4  —  MarketScope Financial Analysis Platform', {
    x: pageWidth / 2 - fontRegular.widthOfTextAtSize('Page 4 of 4  —  MarketScope Financial Analysis Platform', 9) / 2,
    y: 12,
    size: 9,
    font: fontRegular,
    color: gray,
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
