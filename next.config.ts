import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Next.js only uses the app/ directory for routing
  // and doesn't mistake src/pages/ for a Pages Router directory
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
