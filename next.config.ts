import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [
    "@tomo-inc/tomo-evm-kit",
    "@tomo-wallet/uikit-lite",
    "@tomo-inc/shared-type",
  ],
};

export default nextConfig;
