const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ws',
        destination: 'http://localhost:3002/ws',
      },
    ];
  },
};

module.exports = nextConfig;
