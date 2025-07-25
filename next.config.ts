import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    // turbo: false,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
