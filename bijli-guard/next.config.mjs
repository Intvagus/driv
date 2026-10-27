/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: no server needed, hosts free on Vercel or anywhere.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
