const app = require('./src/app');
const config = require('./src/utils/config');

// Start server
const server = app.listen(config.PORT, () => {
  console.log(`🎉 Server listening at http://localhost:${config.PORT} 🎉`);
  console.log(`Environment: ${config.NODE_ENV}`);
});

module.exports = server; 