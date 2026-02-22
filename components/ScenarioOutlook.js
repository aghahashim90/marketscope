export default function ScenarioOutlook({ scenarios }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Scenario Outlook
      </h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-600 mb-2">
          Bullish Scenario
        </h3>
        <p className="text-gray-700">{scenarios.bullish}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Bearish Scenario
        </h3>
        <p className="text-gray-700">{scenarios.bearish}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Neutral Scenario
        </h3>
        <p className="text-gray-700">{scenarios.neutral}</p>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Projection Range (3–5 Days)
        </h3>
        <p className="text-gray-700">{scenarios.projection}</p>
      </div>
    </div>
  )
}
