
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Permite que o build termine mesmo se houver avisos, 
    // mas o exclude no tsconfig já resolve o erro principal.
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
