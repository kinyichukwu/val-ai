import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: false,
    responseLimit: '8mb',
  },
};

export default nextConfig;
