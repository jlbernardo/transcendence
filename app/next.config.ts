const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ws',
        destination: process.env.GAME_SERVICE_URL || 'http://game_service:3002/ws',
      },
    ];
  },
};

module.exports = nextConfig;
