/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // pptxgenjs (client-side PowerPoint export) references optional Node
    // built-ins (via "node:" scheme specifiers) it never actually uses in
    // the browser; strip the scheme so resolve.fallback can stub them out.
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, https: false, path: false, os: false };
    }
    return config;
  },
};

export default nextConfig;
