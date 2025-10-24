const fs = require('fs');
const path = require('path');

/**
 * Security Dashboard
 * Security metrics and monitoring dashboard
 */
class SecurityDashboard {
  constructor(options = {}) {
    this.options = {
      logDir: options.logDir || './logs',
      retentionDays: options.retentionDays || 30,
      ...options
    };
  }

  /**
   * Get security overview
   */
  getSecurityOverview(days = 7) {
    const overview = {
      totalEvents: 0,
      eventsByType: {},
      eventsByLevel: {},
      violations: 0,
      topIPs: [],
      topUsers: [],
      recentViolations: [],
      securityScore: 0
    };

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayMetrics = this.getDayMetrics(dateString);
      
      overview.totalEvents += dayMetrics.totalEvents;
      overview.violations += dayMetrics.violations;
      
      // Merge events by type
      Object.keys(dayMetrics.eventsByType).forEach(type => {
        overview.eventsByType[type] = (overview.eventsByType[type] || 0) + dayMetrics.eventsByType[type];
      });
      
      // Merge events by level
      Object.keys(dayMetrics.eventsByLevel).forEach(level => {
        overview.eventsByLevel[level] = (overview.eventsByLevel[level] || 0) + dayMetrics.eventsByLevel[level];
      });
    }

    // Calculate security score
    overview.securityScore = this.calculateSecurityScore(overview);
    
    return overview;
  }

  /**
   * Get day metrics
   */
  getDayMetrics(date) {
    const logFile = path.join(this.options.logDir, `security-${date}.log`);
    
    if (!fs.existsSync(logFile)) {
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByLevel: {},
        violations: 0
      };
    }

    try {
      const logContent = fs.readFileSync(logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const events = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(event => event);

      const metrics = {
        totalEvents: events.length,
        eventsByType: {},
        eventsByLevel: {},
        violations: 0
      };

      events.forEach(event => {
        const eventType = event.event || 'unknown';
        metrics.eventsByType[eventType] = (metrics.eventsByType[eventType] || 0) + 1;
        
        const level = event.level || 'unknown';
        metrics.eventsByLevel[level] = (metrics.eventsByLevel[level] || 0) + 1;
        
        if (event.event === 'security_violation') {
          metrics.violations++;
        }
      });

      return metrics;
    } catch (error) {
      console.error('Failed to read day metrics:', error);
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByLevel: {},
        violations: 0
      };
    }
  }

  /**
   * Calculate security score
   */
  calculateSecurityScore(overview) {
    let score = 100;
    
    // Deduct points for violations
    const violationPenalty = Math.min(overview.violations * 5, 50);
    score -= violationPenalty;
    
    // Deduct points for high error rate
    const errorRate = (overview.eventsByLevel.error || 0) / Math.max(overview.totalEvents, 1);
    if (errorRate > 0.1) {
      score -= 20;
    }
    
    // Deduct points for suspicious activity
    const suspiciousEvents = (overview.eventsByType.security_violation || 0) + 
                           (overview.eventsByType.unauthorized_access || 0);
    if (suspiciousEvents > 10) {
      score -= 30;
    }
    
    return Math.max(score, 0);
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit = 50) {
    const events = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Get events from today
    const logFile = path.join(this.options.logDir, `security-${today}.log`);
    
    if (fs.existsSync(logFile)) {
      try {
        const logContent = fs.readFileSync(logFile, 'utf8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
          try {
            const event = JSON.parse(line);
            events.push({
              timestamp: event.timestamp,
              level: event.level,
              message: event.message,
              service: event.service,
              ip: event.ip,
              userId: event.userId,
              event: event.event,
              subEvent: event.subEvent
            });
          } catch {
            // Skip invalid JSON
          }
        });
      } catch (error) {
        console.error('Failed to read recent events:', error);
      }
    }

    // Sort by timestamp (newest first) and limit
    return events
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get security alerts
   */
  getSecurityAlerts() {
    const alerts = [];
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.options.logDir, `security-${today}.log`);
    
    if (!fs.existsSync(logFile)) {
      return alerts;
    }

    try {
      const logContent = fs.readFileSync(logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        try {
          const event = JSON.parse(line);
          
          // High severity events
          if (event.event === 'security_violation' || 
              event.level === 'error' || 
              event.subEvent === 'unauthorized_access') {
            alerts.push({
              timestamp: event.timestamp,
              level: event.level,
              message: event.message,
              service: event.service,
              ip: event.ip,
              userId: event.userId,
              severity: 'high'
            });
          }
          
          // Medium severity events
          else if (event.level === 'warn' || 
                   event.subEvent === 'access_denied' ||
                   event.subEvent === 'rate_limit_exceeded') {
            alerts.push({
              timestamp: event.timestamp,
              level: event.level,
              message: event.message,
              service: event.service,
              ip: event.ip,
              userId: event.userId,
              severity: 'medium'
            });
          }
        } catch {
          // Skip invalid JSON
        }
      });
    } catch (error) {
      console.error('Failed to read security alerts:', error);
    }

    // Sort by timestamp (newest first)
    return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get IP statistics
   */
  getIPStatistics(days = 7) {
    const ipStats = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const logFile = path.join(this.options.logDir, `security-${dateString}.log`);
      
      if (fs.existsSync(logFile)) {
        try {
          const logContent = fs.readFileSync(logFile, 'utf8');
          const lines = logContent.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            try {
              const event = JSON.parse(line);
              if (event.ip) {
                if (!ipStats[event.ip]) {
                  ipStats[event.ip] = {
                    totalRequests: 0,
                    violations: 0,
                    lastSeen: event.timestamp,
                    services: new Set()
                  };
                }
                
                ipStats[event.ip].totalRequests++;
                if (event.event === 'security_violation') {
                  ipStats[event.ip].violations++;
                }
                if (event.service) {
                  ipStats[event.ip].services.add(event.service);
                }
                if (new Date(event.timestamp) > new Date(ipStats[event.ip].lastSeen)) {
                  ipStats[event.ip].lastSeen = event.timestamp;
                }
              }
            } catch {
              // Skip invalid JSON
            }
          });
        } catch (error) {
          console.error('Failed to read IP statistics:', error);
        }
      }
    }

    // Convert to array and sort by violations
    return Object.keys(ipStats).map(ip => ({
      ip,
      totalRequests: ipStats[ip].totalRequests,
      violations: ipStats[ip].violations,
      lastSeen: ipStats[ip].lastSeen,
      services: Array.from(ipStats[ip].services)
    })).sort((a, b) => b.violations - a.violations);
  }

  /**
   * Get user statistics
   */
  getUserStatistics(days = 7) {
    const userStats = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const logFile = path.join(this.options.logDir, `security-${dateString}.log`);
      
      if (fs.existsSync(logFile)) {
        try {
          const logContent = fs.readFileSync(logFile, 'utf8');
          const lines = logContent.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            try {
              const event = JSON.parse(line);
              if (event.userId && event.userId !== 'anonymous') {
                if (!userStats[event.userId]) {
                  userStats[event.userId] = {
                    totalEvents: 0,
                    violations: 0,
                    lastSeen: event.timestamp,
                    services: new Set(),
                    role: event.role
                  };
                }
                
                userStats[event.userId].totalEvents++;
                if (event.event === 'security_violation') {
                  userStats[event.userId].violations++;
                }
                if (event.service) {
                  userStats[event.userId].services.add(event.service);
                }
                if (new Date(event.timestamp) > new Date(userStats[event.userId].lastSeen)) {
                  userStats[event.userId].lastSeen = event.timestamp;
                }
              }
            } catch {
              // Skip invalid JSON
            }
          });
        } catch (error) {
          console.error('Failed to read user statistics:', error);
        }
      }
    }

    // Convert to array and sort by violations
    return Object.keys(userStats).map(userId => ({
      userId,
      totalEvents: userStats[userId].totalEvents,
      violations: userStats[userId].violations,
      lastSeen: userStats[userId].lastSeen,
      services: Array.from(userStats[userId].services),
      role: userStats[userId].role
    })).sort((a, b) => b.violations - a.violations);
  }

  /**
   * Generate security report
   */
  generateSecurityReport(days = 7) {
    const overview = this.getSecurityOverview(days);
    const recentEvents = this.getRecentEvents(100);
    const alerts = this.getSecurityAlerts();
    const ipStats = this.getIPStatistics(days);
    const userStats = this.getUserStatistics(days);

    return {
      period: `${days} days`,
      generatedAt: new Date().toISOString(),
      overview,
      recentEvents: recentEvents.slice(0, 20),
      alerts: alerts.slice(0, 10),
      topIPs: ipStats.slice(0, 10),
      topUsers: userStats.slice(0, 10),
      recommendations: this.generateRecommendations(overview, alerts)
    };
  }

  /**
   * Generate security recommendations
   */
  generateRecommendations(overview, alerts) {
    const recommendations = [];

    if (overview.violations > 10) {
      recommendations.push({
        type: 'high',
        title: 'High Security Violations',
        description: `${overview.violations} security violations detected. Consider implementing additional security measures.`,
        action: 'Review security logs and implement additional monitoring'
      });
    }

    if (overview.eventsByLevel.error > overview.totalEvents * 0.1) {
      recommendations.push({
        type: 'medium',
        title: 'High Error Rate',
        description: 'Error rate is above 10%. This may indicate system issues.',
        action: 'Review error logs and investigate system stability'
      });
    }

    if (alerts.filter(alert => alert.severity === 'high').length > 5) {
      recommendations.push({
        type: 'high',
        title: 'Multiple High Severity Alerts',
        description: 'Multiple high severity security alerts detected.',
        action: 'Immediate investigation required'
      });
    }

    if (overview.securityScore < 70) {
      recommendations.push({
        type: 'medium',
        title: 'Low Security Score',
        description: `Security score is ${overview.securityScore}/100. Security improvements needed.`,
        action: 'Review security policies and implement additional measures'
      });
    }

    return recommendations;
  }
}

/**
 * Factory function to create security dashboard
 */
const createSecurityDashboard = (options = {}) => {
  return new SecurityDashboard(options);
};

module.exports = {
  SecurityDashboard,
  createSecurityDashboard
};
