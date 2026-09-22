import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    dangerouslyAllowSVG: true,
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