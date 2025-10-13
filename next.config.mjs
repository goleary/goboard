/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: "/posts/plaid-webhooks",
        destination: "/posts/2020-01-06-plaid-webhooks",
        permanent: true,
      },
      {
        source: "/posts/solar-car-fridge",
        destination: "/posts/2020-05-09-solar-car-fridge",
        permanent: true,
      },
      {
        source: "/posts/venmo-deeplinking-including-from-web-apps",
        destination:
          "/posts/2020-07-29-venmo-deeplinking-including-from-web-apps",
        permanent: true,
      },
      {
        source: "/posts/using-sentry-with-firebase-functions",
        destination: "/posts/2020-08-16-using-sentry-with-firebase-functions",
        permanent: true,
      },
      {
        source: "/posts/segment-custom-domain-proxy-on-cloudflare",
        destination:
          "/posts/2022-05-04-segment-custom-domain-proxy-on-cloudflare",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-92e63dc55dfd4d2abdb59a6b08457115.r2.dev",
      },
    ],
  },

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

// Merge MDX config with Next.js config
export default nextConfig;
