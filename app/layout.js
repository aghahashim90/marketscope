import './globals.css'

export const metadata = {
  title: 'MarketScope - Financial Analysis Platform',
  description: 'Professional crypto and gold market analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
