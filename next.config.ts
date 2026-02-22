import type { NextConfig } from 'next';

const isGithubPages = process.env['GITHUB_ACTIONS'] === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/ecommerce-rudder-demo' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
