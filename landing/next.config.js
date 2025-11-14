/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercelでは output: 'export' は不要（自動で最適化される）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
