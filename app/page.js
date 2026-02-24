import SearchBar from '../components/SearchBar'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          MarketScope
        </h1>
        <p className="text-xl text-gray-500 mb-2">
          Financial Analysis Platform
        </p>
        <p className="text-sm text-blue-600 font-medium mb-10 uppercase tracking-widest">
          Free Beta Version
        </p>
        <SearchBar />
        <p className="text-xs text-gray-400 mt-6">
          Supports Bitcoin, Ethereum and Gold (XAU/USD)
        </p>
      </div>
    </div>
  )
}
