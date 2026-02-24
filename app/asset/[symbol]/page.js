'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import LoadingSpinner from '../../../components/LoadingSpinner'
import ScenarioOutlook from '../../../components/ScenarioOutlook'
import RiskFactors from '../../../components/RiskFactors'

const PriceChart = dynamic(() => import('../../../components/PriceChart'), { ssr: false })

export default function AssetDetailPage() {
  const params = useParams()
  const symbol = params?.symbol

  const [assetData, setAssetData] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (!symbol) return

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const endpoint = symbol === 'gold' ? '/api/gold' : `/api/crypto/${symbol}`
        const assetResponse = await fetch(endpoint)

        if (!assetResponse.ok) {
          const err = await assetResponse.json()
          throw new Error(err.error || 'Failed to fetch asset data')
        }

        const assetResult = await assetResponse.json()
        setAssetData(assetResult)

        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, assetData: assetResult }),
        })

        if (!analysisResponse.ok) {
          const err = await analysisResponse.json()
          throw new Error(err.error || 'Failed to fetch analysis')
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
      setPdfLoading(true)
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, assetData, analysis }),
      })

      if (!response.ok) throw new Error('Failed to generate PDF')

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
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-700 font-semibold mb-2">Error loading data</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-600">
          <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">MarketScope Analysis</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{assetData.name}</h1>
          <div className="flex items-baseline gap-4 flex-wrap">
            <p className="text-4xl font-semibold text-gray-800">
              ${Number(assetData.currentPrice).toLocaleString()}
            </p>
            <p className={`text-xl font-medium ${assetData.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {assetData.percentageChange >= 0 ? '+' : ''}
              {Number(assetData.percentageChange).toFixed(2)}%
              <span className="text-sm text-gray-400 ml-1">24h</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">30-Day Price Chart</h2>
          <PriceChart data={assetData.historicalPrices} />
        </div>

        {analysis && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Market Summary</h2>
              <p className="text-gray-700 leading-relaxed">{analysis.marketSummary}</p>
            </div>
            <ScenarioOutlook scenarios={analysis.scenarios} />
            <RiskFactors risks={analysis.riskFactors} />
          </>
        )}

        <div className="text-center mt-8 mb-12">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading || !analysis}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pdfLoading ? 'Generating PDF...' : 'Download Light PDF Report'}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
