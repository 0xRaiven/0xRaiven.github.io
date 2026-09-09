import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  ...(!isProd
    ? {
        async redirects() {
          return [
            {
              source: "/keystat",
              destination: "/keystatic",
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
