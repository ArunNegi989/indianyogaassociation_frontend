
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },

  images: {
    qualities: [50, 60, 75],
    formats: ["image/webp"],
    minimumCacheTTL: 2678400,
    dangerouslyAllowLocalIP: isDev,
    dangerouslyAllowSVG: true,

    remotePatterns: [
     
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
        hostname: "www.indianyogaassociation.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "indianyogaassociation.com",
        pathname: "/blog/**",
      },
      {
        protocol: "https",
        hostname: "indianyogaassociation.com",
        pathname: "/uploads/**",
      },
    ],
  },

  reactStrictMode: false,

  async redirects() {
    return [
      {
        source: "/blog/aym-yoga-blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },

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
