const express = require('express');
const { createSecurityDashboard } = require('../utils/securityDashboard');
const { createSecurityLogger } = require('../utils/securityLogger');
const { ResponseUtils } = require('../utils/response');

/**
 * Security Routes
 * Security monitoring and dashboard endpoints
 */
const createSecurityRoutes = (options = {}) => {
  const router = express.Router();
  const dashboard = createSecurityDashboard(options);
  const logger = createSecurityLogger(options);

  /**
   * Security overview endpoint
   */
  router.get('/overview', (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const overview = dashboard.getSecurityOverview(days);
      
      ResponseUtils.success(res, overview, 'Security overview retrieved successfully');
    } catch (error) {
      console.error('Security overview error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security overview', 500);
    }
  });

  /**
   * Recent security events endpoint
   */
  router.get('/events', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const events = dashboard.getRecentEvents(limit);
      
      ResponseUtils.success(res, events, 'Recent security events retrieved successfully');
    } catch (error) {
      console.error('Security events error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security events', 500);
    }
  });

  /**
   * Security alerts endpoint
   */
  router.get('/alerts', (req, res) => {
    try {
      const alerts = dashboard.getSecurityAlerts();
      
      ResponseUtils.success(res, alerts, 'Security alerts retrieved successfully');
    } catch (error) {
      console.error('Security alerts error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security alerts', 500);
    }
  });

  /**
   * IP statistics endpoint
   */
  router.get('/ips', (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const ipStats = dashboard.getIPStatistics(days);
      
      ResponseUtils.success(res, ipStats, 'IP statistics retrieved successfully');
    } catch (error) {
      console.error('IP statistics error:', error);
      ResponseUtils.error(res, 'Failed to retrieve IP statistics', 500);
    }
  });

  /**
   * User statistics endpoint
   */
  router.get('/users', (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const userStats = dashboard.getUserStatistics(days);
      
      ResponseUtils.success(res, userStats, 'User statistics retrieved successfully');
    } catch (error) {
      console.error('User statistics error:', error);
      ResponseUtils.error(res, 'Failed to retrieve user statistics', 500);
    }
  });

  /**
   * Security report endpoint
   */
  router.get('/report', (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const report = dashboard.generateSecurityReport(days);
      
      ResponseUtils.success(res, report, 'Security report generated successfully');
    } catch (error) {
      console.error('Security report error:', error);
      ResponseUtils.error(res, 'Failed to generate security report', 500);
    }
  });

  /**
   * Security metrics endpoint
   */
  router.get('/metrics', (req, res) => {
    try {
      const date = req.query.date || null;
      const metrics = logger.getSecurityMetrics(date);
      
      ResponseUtils.success(res, metrics, 'Security metrics retrieved successfully');
    } catch (error) {
      console.error('Security metrics error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security metrics', 500);
    }
  });

  /**
   * Log security event endpoint
   */
  router.post('/log', (req, res) => {
    try {
      const { level, message, data } = req.body;
      
      if (!level || !message) {
        return ResponseUtils.validationError(res, [{
          field: 'level',
          message: 'Level and message are required'
        }], 'Validation failed');
      }

      logger.log(level, message, data);
      
      ResponseUtils.success(res, null, 'Security event logged successfully');
    } catch (error) {
      console.error('Log security event error:', error);
      ResponseUtils.error(res, 'Failed to log security event', 500);
    }
  });

  /**
   * Clean old logs endpoint
   */
  router.post('/clean-logs', (req, res) => {
    try {
      logger.cleanOldLogs();
      
      ResponseUtils.success(res, null, 'Old logs cleaned successfully');
    } catch (error) {
      console.error('Clean logs error:', error);
      ResponseUtils.error(res, 'Failed to clean old logs', 500);
    }
  });

  return router;
};

module.exports = createSecurityRoutes;
