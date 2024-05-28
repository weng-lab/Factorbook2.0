import withTM from 'next-transpile-modules';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withTranspileModules = withTM(['@mui/material', '@mui/system', '@mui/icons-material']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
    };
    return config;
  },
};

export default withTranspileModules(nextConfig);
