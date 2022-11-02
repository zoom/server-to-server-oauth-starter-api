/**
 * dotenv gives us access to private variables held in a .env file
 * never expose this .env file publicly
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { debug } = require('node:console');

const redis = require('./configs/redis');
const { tokenCheck } = require('./middlewares/tokenCheck');

const app = express();

/**
   * Default connection to redis - port 6379
   * See https://github.com/redis/node-redis/blob/master/docs/client-configuration.md for additional config objects
   */
(async () => {
  await redis.connect();
})();

redis.on('connect', (err) => {
  if (err) {
    console.log('Could not establish connection with redis');
  } else {
    console.log('Connected to redis successfully');
  }
});

app.use(cookieParser());

// Add Global Middlewares
app.use([
  cors(),
  express.json(),
  express.urlencoded({ extended: false }),
]);

app.options('*', cors());

/**
  * Add API Routes w/ tokenCheck middleware
  */
app.use('/api/users', tokenCheck, require('./routes/api/users'));
app.use('/api/meetings', tokenCheck, require('./routes/api/meetings'));
app.use('/api/webinars', tokenCheck, require('./routes/api/webinars'));

/**
  *    API Route Breakdown:
  *
  *    __Users__
  *    GET     /api/users --> list users -
  *    POST    /api/users/add --> create users -
  *    GET     /api/users/:userId --> get a user -
  *    GET     /api/users/:userId/settings --> get user settings -
  *    PATCH   /api/users/:userId/settings --> update user settings -
  *    PATCH   /api/users/:userId --> update a user -
  *    DELETE  /api/users/:userId --> delete a user -
  *    GET     /api/users/:userId/meetings --> list meetings -
  *    GET     /api/users/:userId/webinars --> list webinars -
  *    GET     /api/users/:userId/recordings --> list all recordings -
  *
  *    __Webinars__
  *    GET     /api/webinars/:webinarId --> get a webinar -
  *    POST    /api/webinars/:userId --> create a webinar -
  *    DELETE  /api/webinars/:webinarId --> delete a webinar
  *    PATCH   /api/webinars/:webinarId --> update a webinar -
  *    GET     /api/webinars/:webinarId/registrants --> list webinar registrants -
  *    PUT     /api/webinars/:webinarId/registrants/status --> update registrant's status -
  *    GET     /api/webinars/:webinarId/report/participants --> get webinar participant reports -
  *    POST    /api/webinars/:webinarId/registrants --> add a webinar registrant -
  *
  *    __Meetings__
  *    GET     /api/meetings/:meetingId --> get a meeting -
  *    POST    /api/meetings/:userId -> create a meeting -
  *    PATCH   /api/meetings/:meetingId --> update a meeting -
  *    DELETE  /api/meetings/:meetingId --> delete a meeting -
  *    GET     /api/meetings/:meetingId/report/participants --> get meeting participant reports -
  *    DELETE  /api/meetings/:meetingId/recordings --> delete meeting recordings -
  */

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${[PORT]}!`));

/**
  * Graceful shutdown, removes access_token from redis
  */
const cleanup = async () => {
  debug('\nClosing HTTP server');
  await redis.del('access_token');
  server.close(() => {
    debug('\nHTTP server closed');
    redis.quit(() => process.exit());
  });
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
