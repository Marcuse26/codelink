import type { NextConfig } from "next";

// Se requiere 'require' para next-pwa porque es un módulo CommonJS
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withPWA(nextConfig);