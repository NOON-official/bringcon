module.exports = {
  apps: [
    {
      name: "client",
      script: "npm run frontend-prod",

      env: {
        PORT: 3000,
        NODE_ENV: "development",
      },

      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
    },
    {
      name: "server",
      script: "npm run backend",

      env: {
        PORT: 443,
        NODE_ENV: "development",
      },

      env_production: {
        PORT: 443,
        NODE_ENV: "production",
      },
    },
  ],
};
