import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const destination = process.env.NEXT_PUBLIC_EXTERNAL_API;

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: {
  //   buildActivity: false,
  // },
  reactStrictMode: true,
  env: {
    DESTINATION: destination
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // i18n: {
  //   locales: ['en', 'fa'],
  //   defaultLocale: 'fa'
  // },
  async rewrites() {
    return [
      {
        source: '/cloud/:path*',
        destination: `${destination}/:path*`,
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
