import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Increase to handle 10MB PDFs + form data
    },
  },
};

export default nextConfig;
