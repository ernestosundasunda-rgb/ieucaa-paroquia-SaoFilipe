import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvg: './lib/empty-module.ts',
    },
  },
}

export default nextConfig
