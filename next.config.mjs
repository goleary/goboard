/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/lake-stats",
  assetPrefix: "/lake-stats",
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/lake-stats",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
