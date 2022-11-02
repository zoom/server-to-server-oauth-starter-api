const express = require('express');
const axios = require('axios');
const qs = require('query-string');

const errorHandler = require('../../utils/errorHandler');
const { ZOOM_API_BASE_URL } = require('../../constants');

const router = express.Router();

/**
 * Get a webinar
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinar
 */
router.get('/:webinarId', async (req, res) => {
  const { headerConfig, params } = req;
  const { webinarId } = params;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/webinars/${webinarId}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching webinar: ${webinarId}`);
  }
});

/**
 * Create a webinar
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarCreate
 */
router.post('/:userId', async (req, res) => {
  const { headerConfig, body, params } = req;
  const { userId } = params;

  try {
    const request = await axios.post(`${ZOOM_API_BASE_URL}/users/${userId}/webinars`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error creating webinar for user: ${userId}`);
  }
});

/**
 * Delete a webinar
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarDelete
 */
router.delete('/:webinarId', async (req, res) => {
  const { headerConfig, params } = req;
  const { webinarId } = params;

  try {
    const request = await axios.delete(`${ZOOM_API_BASE_URL}/webinars/${webinarId}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error deleting webinar: ${webinarId}`);
  }
});

/**
 * Update a webinar
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarUpdate
 */
router.patch('/:webinarId', async (req, res) => {
  const { headerConfig, params, body } = req;
  const { webinarId } = params;

  try {
    const request = await axios.patch(`${ZOOM_API_BASE_URL}/webinars/${webinarId}`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error updating webinar: ${webinarId}`);
  }
});

/**
 * List webinar registrants
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarRegistrants
 */
router.get('/:webinarId/registrants', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { webinarId } = params;
  const { status, next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/webinars/${webinarId}/registrants?${qs.stringify({
      status,
      next_page_token,
    })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching registrants for webinar: ${webinarId}`);
  }
});

/**
 * Update registrant's status
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarRegistrantStatus
 */
router.put('/:webinarId/registrants/status', async (req, res) => {
  const { headerConfig, params, body } = req;
  const { webinarId } = params;

  try {
    const request = await axios.put(`${ZOOM_API_BASE_URL}/webinars/${webinarId}/registrants/status`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, 'Error updating webinar registrant status');
  }
});

/**
 * Get webinar participant reports
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportWebinarParticipants
 */
router.get('/:webinarId/report/participants', async (req, res) => {
  const { headerConfig, params, query } = req;
  const { webinarId } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/report/webinars/${webinarId}/participants?${qs.stringify({
      next_page_token,
    })}`, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching webinar participants for webinar: ${webinarId}`);
  }
});

/**
 * Add a webinar registrant
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinarRegistrantCreate
 */
router.post('/:webinarId/registrants', async (req, res) => {
  const { headerConfig, params, body } = req;
  const { webinarId } = params;

  try {
    const request = await axios.post(`${ZOOM_API_BASE_URL}/webinars/${webinarId}/registrants`, body, headerConfig);
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error creating registrant for webinar: ${webinarId}`);
  }
});

module.exports = router;
