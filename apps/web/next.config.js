/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsyjdelcgyjgdaffucru.supabase.co",
        pathname: "/storage/v1/object/public/securegate-logos/**",
      },
    ],
  },
};

export default nextConfig;
