const express = require("express");
const router = express.Router();
const healthController = require("../controllers/health.controller");

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: System health check
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get system health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: number
 *                 services:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         responseTimeMs:
 *                           type: number
 */
router.get("/", healthController.getHealthStatus);

module.exports = router;
