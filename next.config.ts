import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true, // render-blocking CSS hatata hai
  },
  images: {
    qualities: [60, 75], // Next 16: sirf listed qualities allowed hain
    // Sirf dev mein localhost:5000 se image optimize karne ke liye
    dangerouslyAllowLocalIP: isDev,
    dangerouslyAllowSVG: true,
    remotePatterns: [
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.indianyogaassociation.com",
        pathname: "/blog/**",
      },
      {
        protocol: "https",
        hostname: "indianyogaassociation.com",
        pathname: "/blog/**",
      },
    ],
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