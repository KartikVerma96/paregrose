/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWC minification is enabled by default in Next.js 15 (no need to specify)
  // Configure SWC via .swcrc file to preserve function names
  
  // Compiler options to prevent minification issues
  compiler: {
    // Preserve function names and class names in production
    // This prevents errors like "d is not a function", "f is not a function"
    // Remove console logs in production (optional - keeping error/warn for debugging)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for better stability
  experimental: {
    // Optimize package imports to reduce bundle size and prevent issues
    optimizePackageImports: ['@heroicons/react', 'lucide-react', 'react-icons', 'framer-motion'],
  },
  
  // Webpack configuration for additional safety
  webpack: (config, { isServer, dev }) => {
    // Fix webpack chunk resolution issues
    if (config.resolve) {
      config.resolve.symlinks = false;
    }
    
    // In production builds, ensure proper handling of function names
    if (!isServer && !dev) {
      if (!config.optimization) {
        config.optimization = {};
      }
      // Ensure module concatenation doesn't break function references
      config.optimization.concatenateModules = true;
      // Use deterministic chunk IDs to prevent missing chunk errors
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
  
  // Production source maps disabled for smaller builds (enable if needed for debugging)
  productionBrowserSourceMaps: false,
  
  // Ensure proper handling of dynamic imports
  reactStrictMode: true,
};

export default nextConfig;
