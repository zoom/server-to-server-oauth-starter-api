# S2S OAuth Starter App

This boilerplate app creates a functional starting point for building internal applications using Zoom's REST APIs without needing to handle authentication yourself. Add routes or update these starting points with authentication and token refresh already provided by the server.

Built with [Express](https://expressjs.com/) for the server, [Redis](https://redis.io/) for token storage, and [Axios](https://axios-http.com/docs/intro) for requests, this app is designed as a starting point. To update or add new Zoom API endpoints, add [Express routes](http://expressjs.com/en/5x/api.html#router) in /routes/api (and import them in index.js).

Note: Zoom server-to-server tokens are scoped during the app creation workflow. Your app's permissions will reflect what you register when setting up the app.

## Getting started

1. **Create a server-to-server OAuth app** Before cloning, set up your app and collect your credentials. For questions on this, reference the docs on creating a server-to-server app. Make sure you activate the app. Follow our [set up documentation](https://developers.zoom.us/docs/internal-apps/) or[ this video](https://www.youtube.com/watch?v=OkBE7CHVzho) for a more complete walk through.
2. **Add scopes to your app.** In your app's Scopes tab, add the following scopes: `meeting:write:admin`, `recording:write:admin`, `report:read:admin`, `user:write:admin`, `webinar:write:admin` . _Note: If you add additional API routes to this starter, you may need to add the corresponding scopes._
3. **Install and run [Docker Desktop](https://www.docker.com/products/docker-desktop/).**
4. **Clone this repo** -- `git clone git@github.com:zoom/server-to-server-oauth-starter-api.git`.
5. **Add environment variables**. Add a **.env** file to the top level of the repository -- `touch .env`. Fill in the following values from your app. The project includes an example in .env.example

```
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
```

## Usage

To run the project in development mode (with hot reloading):

`docker-compose up dev`

To run the project in production mode:

`docker-compose up prod`

The app will now be running in a docker container available to test at http://localhost:8080/api/...

Sending a request to your server's routes, you'll now be able to make requests to Zoom APIs. To test, open up a terminal or a tool like Postman and send a GET request to http://localhost:8080/api/users. If everything's set up, this will return a list of all the users on your account.

Your server now provides the following API Routes:

#### Users

- **GET** /api/users --> _list users_
- **POST** /api/users/add --> _create users_
- **GET** /api/users/:userId --> _get a user_
- **GET** /api/users/:userId/settings --> _get user settings_
- **PATCH** /api/users/:userId/settings --> _update user settings_
- **PATCH** /api/users/:userId --> _update a user_
- **DELETE** /api/users/:userId --> _delete a user_
- **GET** /api/users/:userId/meetings --> _list meetings_
- **GET** /api/users/:userId/webinars --> _list webinars_
- **GET** /api/users/:userId/recordings --> _list all recordings_

#### Meetings

- **GET** /api/meetings/:meetingId --> _get a meeting_
- **POST** /api/meetings/:userId --> _create a meeting_
- **PATCH** /api/meetings/:meetingId --> _update a meeting_
- **DELETE** /api/meetings/:meetingId --> _delete a meeting_
- **GET** /api/meetings/:meetingId/report/participants --> _get meeting participant reports_
- **DELETE** /api/meetings/:meetingId/recordings --> _delete meeting recordings_

#### Webinars

- **GET** /api/webinars/:webinarId --> _get a webinar_
- **POST** /api/webinars/:userId --> _create a webinar_
- **DELETE** /api/webinars/:webinarId --> _delete a webinar_
- **PATCH** /api/webinars/:webinarId --> _update a webinar_
- **GET** /api/webinars/:webinarId/registrants --> _list webinar registrants_
- **PUT** /api/webinars/:webinarId/registrants/status --> _update registrant's status_
- **GET** /api/webinars/:webinarId/report/participants --> _get webinar participant reports_
- **POST** /api/webinars/:webinarId/registrants --> _add a webinar registrant_

To stop your container, run the following:

`docker stop <container_id>` or `docker-compose down`

## Adding new API routes

As a starting point, this app predefines API routes in `/routes/api` for Meetings, Webinars, and Users, and Reports. Add new routes or update existing ones with the Zoom APIs you are looking to use.

If you wanted to add endpoints for Dashboards, for example, create a new route by adding `routes/api/dashboards.js` using `routes/api/meetings.js` as a template:

```js
// create a new file:
// routes/api/dashboards.js
const express = require("express");
const axios = require("axios");
const qs = require("query-string");

const errorHandler = require("../../utils/errorHandler");
const { ZOOM_API_BASE_URL } = require("../../constants");

const router = express.Router();

router.get("/metrics/meetings", async (req, res) => {
  const { headerConfig, params } = req;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/metrics/meetings`,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching list of meetings`);
  }
});

module.exports = router;
```

In index.js, import the new routes:

```js
/**
 * Add API Routes w/ tokenCheck middleware
 */
app.use("/api/dashboards", tokenCheck, require("./routes/api/dashboards"));
```

## Need help?

For help using this app or any of Zoom's APIs, head to our [Developer Forum](https://devforum.zoom.us/c/api-and-webhooks).

### Documentation

- [API Reference](https://developers.zoom.us/docs/api/)
- [Create a Server-to-Server OAuth App](https://developers.zoom.us/docs/internal-apps/create/)
- [How to create and use a Server to Server OAuth App (Video)](https://www.youtube.com/watch?v=OkBE7CHVzho)
- [Server-to-Server OAuth](https://developers.zoom.us/docs/internal-apps/s2s-oauth/)
