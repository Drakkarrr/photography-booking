/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "upload.wikimedia.org",
      "vivnpay.vn",
      "encrypted-tbn0.gstatic.com",
      "data-server-shop.onrender.com",
    ],
    loader: "default",
  },
};

module.exports = nextConfig;
