import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Production backend
      {
        protocol: "https",
        hostname: "indianyoga.aymyogaschool.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.indianyoga.aymyogaschool.com",
        pathname: "/uploads/**",
      },
      // Local dev backend — keep only for local development
      {
        protocol: "http",
        hostname: "192.168.1.22",
        port: "5000",
        pathname: "/uploads/**",
      },
      // Unsplash fallback images used in Aymfullpage.tsx
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    dangerouslyAllowSVG: true,
    // REMOVED: unoptimized: true
    // This was disabling Next.js image optimization for the ENTIRE app —
    // every <Image> component was silently serving raw, unresized,
    // non-WebP files no matter what props you passed it.
  },

  reactStrictMode: false,

  async rewrites() {
    return [
      {
        source: "/:path*.html",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;