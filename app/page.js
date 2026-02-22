import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          MarketScope
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Financial Analysis Platform
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Free Beta Version - Crypto & Gold Market Analysis
        </p>
        <SearchBar />
      </div>
    </div>
  )
}
