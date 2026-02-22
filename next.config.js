/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'pdfkit': 'commonjs pdfkit',
        'canvas': 'canvas',
      })
    }
    return config
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  },
}

module.exports = nextConfig
