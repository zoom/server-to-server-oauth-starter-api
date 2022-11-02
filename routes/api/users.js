const express = require('express');
const axios = require('axios');
const qs = require('query-string');

const errorHandler = require('../../utils/errorHandler');
const { ZOOM_API_BASE_URL } = require('../../constants');

const router = express.Router();

/**
 * List users
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users
 */
router.get('/', async (req, res) => {
  const { headerConfig } = req;
  const { status, next_page_token } = req.query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users?${qs.stringify({ status, next_page_token })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, 'Error fetching users');
  }
});

/**
 * Create users
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userCreate
 */
router.post('/add', async (req, res) => {
  const { headerConfig, body } = req;

  try {
    const request = await axios.post(`${ZOOM_API_BASE_URL}/users`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, 'Error creating user');
  }
});

/**
 * Get a user
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/user
 */
router.get('/:userId', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { userId } = params;
  const { status } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users/${userId}?${qs.stringify({ status })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching user: ${userId}`);
  }
});

/**
 * Get user settings
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userSettings
 */
router.get('/:userId/settings', async (req, res) => {
  const { headerConfig, params } = req;
  const { userId } = params;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users/${userId}/settings`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching settings for user: ${userId}`);
  }
});

/**
 * Update user settings
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userSettingsUpdate
 */
router.patch('/:userId/settings', async (req, res) => {
  const { headerConfig, params, body } = req;
  const { userId } = params;

  try {
    const request = await axios.patch(`${ZOOM_API_BASE_URL}/users/${userId}/settings`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error updating settings for user: ${userId}`);
  }
});

/**
 * Update a user
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userUpdate
 */
router.patch('/:userId', async (req, res) => {
  const { headerConfig, params, body } = req;
  const { userId } = params;

  try {
    const request = await axios.patch(`${ZOOM_API_BASE_URL}/users/${userId}`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error updating user: ${userId}`);
  }
});

/**
 * Delete a user
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userDelete
 */
router.delete('/:userId', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { userId } = params;
  const { action } = query;

  try {
    const request = await axios.delete(`${ZOOM_API_BASE_URL}/users/${userId}?${qs.stringify({ action })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error deleting user: ${userId}`);
  }
});

/**
 * List meetings
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetings
 */
router.get('/:userId/meetings', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { userId } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users/${userId}/meetings?${qs.stringify({ next_page_token })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching meetings for user: ${userId}`);
  }
});

/**
 * List webinars
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinars
 */
router.get('/:userId/webinars', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { userId } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users/${userId}/webinars?${qs.stringify({ next_page_token })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching webinars for user: ${userId}`);
  }
});

/**
 * List all recordings
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/recordingsList
 */
router.get('/:userId/recordings', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { userId } = params;
  const { from, to, next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/users/${userId}/recordings?${qs.stringify({
      from,
      to,
      next_page_token,
    })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching recordings for user: ${userId}`);
  }
});

module.exports = router;
