import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pollinations.ai",
        port: "",
        pathname: "/p/**",
      },
    ],
  },

};

export default nextConfig;
