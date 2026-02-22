'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PriceChart from '@/components/PriceChart'
import ScenarioOutlook from '@/components/ScenarioOutlook'
import RiskFactors from '@/components/RiskFactors'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AssetDetailPage() {
  const params = useParams()
  const { symbol } = params

  const [assetData, setAssetData] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        let assetResponse
        if (symbol === 'gold') {
          assetResponse = await fetch('/api/gold')
        } else {
          assetResponse = await fetch(`/api/crypto/${symbol}`)
        }

        if (!assetResponse.ok) {
          throw new Error('Failed to fetch asset data')
        }

        const assetResult = await assetResponse.json()
        setAssetData(assetResult)

        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol,
            assetData: assetResult,
          }),
        })

        if (!analysisResponse.ok) {
          throw new Error('Failed to fetch analysis')
        }

        const analysisResult = await analysisResponse.json()
        setAnalysis(analysisResult)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          assetData,
          analysis,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${symbol}-analysis-report.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error generating PDF: ' + err.message)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center text-red-600 mt-20">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {assetData.name}
          </h1>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-semibold text-gray-800">
              ${assetData.currentPrice.toLocaleString()}
            </p>
            <p
              className={`text-xl font-medium ${
                assetData.percentageChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {assetData.percentageChange >= 0 ? '+' : ''}
              {assetData.percentageChange.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            30-Day Price Chart
          </h2>
          <PriceChart data={assetData.historicalPrices} />
        </div>

        {analysis && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Market Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {analysis.marketSummary}
              </p>
            </div>

            <ScenarioOutlook scenarios={analysis.scenarios} />
            <RiskFactors risks={analysis.riskFactors} />
          </>
        )}

        <div className="text-center mt-8">
          <button
            onClick={handleDownloadPDF}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download Light PDF Report
          </button>
        </div>
      </div>
    </div>
  )
}
