import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.22",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true, // 👈 🔥 THIS LINE FIXES PRIVATE IP ISSUE
  },
  reactStrictMode: false,
};

export default nextConfig;