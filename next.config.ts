import withPWA from 'next-pwa';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suas demais opções de configuração do Next.js, se houver
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
