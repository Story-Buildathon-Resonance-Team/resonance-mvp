import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    // Allow build to pass even with TypeScript errors during development
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow build to pass even with ESLint errors during development
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@tomo-inc/tomo-evm-kit",
    "@tomo-wallet/uikit-lite",
    "@tomo-inc/shared-type",
  ],
};

export default nextConfig;
