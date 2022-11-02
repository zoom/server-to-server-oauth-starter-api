const { createClient } = require('redis');

// Socket required for node redis <-> docker-compose connection
const Redis = createClient({ socket: { host: 'redis', port: 6379 } });

module.exports = Redis;
