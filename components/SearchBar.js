'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUPPORTED_ASSETS = [
  { name: 'Bitcoin', symbol: 'bitcoin', type: 'crypto' },
  { name: 'Ethereum', symbol: 'ethereum', type: 'crypto' },
  { name: 'Gold', symbol: 'gold', type: 'gold' },
]

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      setSuggestions([])
      return
    }

    const filtered = SUPPORTED_ASSETS.filter((asset) =>
      asset.name.toLowerCase().includes(value.toLowerCase())
    )
    setSuggestions(filtered)
  }

  const handleSelect = (asset) => {
    router.push(`/asset/${asset.symbol}`)
    setQuery('')
    setSuggestions([])
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search crypto or gold (e.g., Bitcoin, Gold)"
        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((asset) => (
            <li
              key={asset.symbol}
              onClick={() => handleSelect(asset)}
              className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {asset.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
