import './globals.css'

export const metadata = {
  title: 'MarketScope - Financial Analysis Platform',
  description: 'Professional crypto and gold market analysis. Free Beta Version.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
