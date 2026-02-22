import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAnalysis(symbol, assetData) {
  const prompt = `You are a professional financial analyst. Provide a structured market analysis for ${assetData.name}.

Current Price: $${assetData.currentPrice}
24h Change: ${assetData.percentageChange}%
Historical trend: ${assetData.historicalPrices.length} days of data available

Provide your analysis in this EXACT format with no additional commentary or markdown:

Market Summary:
[Your summary here]

Bullish Scenario:
[Your bullish scenario here]

Bearish Scenario:
[Your bearish scenario here]

Neutral Scenario:
[Your neutral scenario here]

Risk Factors:
[Your risk factors here]

Projection Range (3–5 Days):
[Your projection here]

Rules:
- Be analytical and neutral
- No buy/sell recommendations
- No financial guarantees
- Use plain text only
- Follow the exact format above`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content
    return parseAnalysis(content)
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('Failed to generate analysis')
  }
}

function parseAnalysis(content) {
  const sections = {
    marketSummary: '',
    scenarios: {
      bullish: '',
      bearish: '',
      neutral: '',
      projection: '',
    },
    riskFactors: '',
  }

  const lines = content.split('\n')
  let currentSection = null

  for (let line of lines) {
    if (line.startsWith('Market Summary:')) {
      currentSection = 'marketSummary'
      continue
    } else if (line.startsWith('Bullish Scenario:')) {
      currentSection = 'bullish'
      continue
    } else if (line.startsWith('Bearish Scenario:')) {
      currentSection = 'bearish'
      continue
    } else if (line.startsWith('Neutral Scenario:')) {
      currentSection = 'neutral'
      continue
    } else if (line.startsWith('Risk Factors:')) {
      currentSection = 'riskFactors'
      continue
    } else if (line.startsWith('Projection Range')) {
      currentSection = 'projection'
      continue
    }

    if (currentSection && line.trim() !== '') {
      if (currentSection === 'marketSummary') {
        sections.marketSummary += line + ' '
      } else if (currentSection === 'riskFactors') {
        sections.riskFactors += line + ' '
      } else if (
        currentSection === 'bullish' ||
        currentSection === 'bearish' ||
        currentSection === 'neutral' ||
        currentSection === 'projection'
      ) {
        sections.scenarios[currentSection] += line + ' '
      }
    }
  }

  sections.marketSummary = sections.marketSummary.trim()
  sections.riskFactors = sections.riskFactors.trim()
  sections.scenarios.bullish = sections.scenarios.bullish.trim()
  sections.scenarios.bearish = sections.scenarios.bearish.trim()
  sections.scenarios.neutral = sections.scenarios.neutral.trim()
  sections.scenarios.projection = sections.scenarios.projection.trim()

  return sections
}
