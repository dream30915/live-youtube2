module.exports = {
  apps: [
    {
      name: 'puppeteer-proxy',
      script: 'puppeteer-proxy.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { PORT: 4000 }
    },
    {
      name: 'api-proxy',
      script: 'api-proxy.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { PORT: 4100 }
    }
  ]
};
