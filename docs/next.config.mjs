import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response', 'typescript', 'twoslash'],
  reactStrictMode: true,
  images: {
    qualities: [75, 80, 100],
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/framework',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
