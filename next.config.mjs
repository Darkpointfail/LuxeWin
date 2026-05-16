/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Tree-shake des imports « barrel » → moins de modules à parser en dev & en build.
   * (Turbopack + Webpack en profitent.)
   */
  experimental: {
    /** Moins de modules à parser au 1er chargement dev (barrels lourds). */
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
