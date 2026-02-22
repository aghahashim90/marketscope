export default function RiskFactors({ risks }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Risk Factors
      </h2>
      <p className="text-gray-700 leading-relaxed">{risks}</p>
    </div>
  )
}
