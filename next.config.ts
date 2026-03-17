import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.20.10.2",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true, // 👈 🔥 THIS LINE FIXES PRIVATE IP ISSUE
  },
};

export default nextConfig;