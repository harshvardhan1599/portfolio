import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (≈25–40% smaller than WebP for UI shots), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Cap the largest generated variant at 1920 (sources are downscaled to
    // 1920 too) — drops the 2048/3840 variants that big screenshots would pick.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    qualities: [60, 75],
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
