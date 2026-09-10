/** @type {import('next').NextConfig} */
onst nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  transpilePackages: [
    "react-native-web",
    "lottie-react",
    "@react-navigation/native",
    "@react-navigation/bottom-tabs",
    "@react-navigation/native-stack",
    "react-native-screens",
    "react-native-safe-area-context",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default nextConfig;
