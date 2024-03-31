/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/lake-stats" : undefined,
};

export default nextConfig;
