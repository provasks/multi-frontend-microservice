const { createSecurityLogger } = require('./securityLogger');
const { createSecurityDashboard } = require('./securityDashboard');

/**
 * Security Monitoring Utilities
 * Advanced security monitoring and alerting system
 */
class SecurityMonitoring {
  constructor(options = {}) {
    this.options = {
      enableRealTimeMonitoring: options.enableRealTimeMonitoring !== false,
      enableAnomalyDetection: options.enableAnomalyDetection !== false,
      enableThreatIntelligence: options.enableThreatIntelligence !== false,
      alertThresholds: {
        highSeverity: options.alertThresholds?.highSeverity || 5,
        mediumSeverity: options.alertThresholds?.mediumSeverity || 10,
        lowSeverity: options.alertThresholds?.lowSeverity || 20,
        ...options.alertThresholds
      },
      ...options
    };

    this.logger = createSecurityLogger(options);
    this.dashboard = createSecurityDashboard(options);
    this.monitoringData = {
      events: [],
      anomalies: [],
      threats: [],
      alerts: []
    };
  }

  /**
   * Monitor security events in real-time
   */
  startRealTimeMonitoring() {
    if (!this.options.enableRealTimeMonitoring) {
      return;
    }

    console.log('Starting real-time security monitoring...');
    
    // Monitor for suspicious patterns
    setInterval(() => {
      this.analyzeSecurityPatterns();
    }, 60000); // Every minute

    // Monitor for anomalies
    if (this.options.enableAnomalyDetection) {
      setInterval(() => {
        this.detectAnomalies();
      }, 300000); // Every 5 minutes
    }

    // Monitor for threats
    if (this.options.enableThreatIntelligence) {
      setInterval(() => {
        this.analyzeThreats();
      }, 900000); // Every 15 minutes
    }
  }

  /**
   * Analyze security patterns
   */
  async analyzeSecurityPatterns() {
    try {
      const recentEvents = this.dashboard.getRecentEvents(100);
      const patterns = this.identifySecurityPatterns(recentEvents);
      
      patterns.forEach(pattern => {
        this.logger.log('warn', `Security pattern detected: ${pattern.type}`, {
          pattern: pattern.type,
          count: pattern.count,
          severity: pattern.severity,
          details: pattern.details
        });
        
        this.monitoringData.events.push({
          timestamp: new Date().toISOString(),
          type: 'pattern_detected',
          pattern: pattern.type,
          severity: pattern.severity,
          count: pattern.count
        });
      });
    } catch (error) {
      console.error('Security pattern analysis error:', error);
    }
  }

  /**
   * Identify security patterns
   */
  identifySecurityPatterns(events) {
    const patterns = [];
    
    // Group events by IP
    const ipGroups = {};
    events.forEach(event => {
      if (event.ip) {
        if (!ipGroups[event.ip]) {
          ipGroups[event.ip] = [];
        }
        ipGroups[event.ip].push(event);
      }
    });
    
    // Check for suspicious IP activity
    Object.entries(ipGroups).forEach(([ip, ipEvents]) => {
      if (ipEvents.length > 10) {
        patterns.push({
          type: 'suspicious_ip_activity',
          count: ipEvents.length,
          severity: 'medium',
          details: { ip, eventCount: ipEvents.length }
        });
      }
    });
    
    // Group events by user
    const userGroups = {};
    events.forEach(event => {
      if (event.userId && event.userId !== 'anonymous') {
        if (!userGroups[event.userId]) {
          userGroups[event.userId] = [];
        }
        userGroups[event.userId].push(event);
      }
    });
    
    // Check for suspicious user activity
    Object.entries(userGroups).forEach(([userId, userEvents]) => {
      if (userEvents.length > 20) {
        patterns.push({
          type: 'suspicious_user_activity',
          count: userEvents.length,
          severity: 'medium',
          details: { userId, eventCount: userEvents.length }
        });
      }
    });
    
    // Check for repeated security violations
    const violationEvents = events.filter(event => 
      event.event === 'security_violation' || event.level === 'error'
    );
    
    if (violationEvents.length > 5) {
      patterns.push({
        type: 'repeated_security_violations',
        count: violationEvents.length,
        severity: 'high',
        details: { violationCount: violationEvents.length }
      });
    }
    
    return patterns;
  }

  /**
   * Detect anomalies
   */
  async detectAnomalies() {
    try {
      const overview = this.dashboard.getSecurityOverview(1);
      const anomalies = [];
      
      // Check for unusual event volume
      if (overview.totalEvents > 1000) {
        anomalies.push({
          type: 'high_event_volume',
          severity: 'medium',
          description: 'Unusually high number of security events',
          value: overview.totalEvents,
          threshold: 1000
        });
      }
      
      // Check for high violation rate
      const violationRate = overview.violations / Math.max(overview.totalEvents, 1);
      if (violationRate > 0.1) {
        anomalies.push({
          type: 'high_violation_rate',
          severity: 'high',
          description: 'High security violation rate detected',
          value: violationRate,
          threshold: 0.1
        });
      }
      
      // Check for security score drop
      if (overview.securityScore < 70) {
        anomalies.push({
          type: 'low_security_score',
          severity: 'high',
          description: 'Security score has dropped significantly',
          value: overview.securityScore,
          threshold: 70
        });
      }
      
      anomalies.forEach(anomaly => {
        this.logger.log('warn', `Security anomaly detected: ${anomaly.type}`, {
          anomaly: anomaly.type,
          severity: anomaly.severity,
          description: anomaly.description,
          value: anomaly.value,
          threshold: anomaly.threshold
        });
        
        this.monitoringData.anomalies.push({
          timestamp: new Date().toISOString(),
          type: 'anomaly_detected',
          anomaly: anomaly.type,
          severity: anomaly.severity,
          description: anomaly.description
        });
      });
    } catch (error) {
      console.error('Anomaly detection error:', error);
    }
  }

  /**
   * Analyze threats
   */
  async analyzeThreats() {
    try {
      const ipStats = this.dashboard.getIPStatistics(1);
      const userStats = this.dashboard.getUserStatistics(1);
      const threats = [];
      
      // Check for high-risk IPs
      const highRiskIPs = ipStats.filter(ip => ip.violations > 5);
      highRiskIPs.forEach(ip => {
        threats.push({
          type: 'high_risk_ip',
          severity: 'high',
          description: `IP ${ip.ip} has ${ip.violations} violations`,
          ip: ip.ip,
          violations: ip.violations
        });
      });
      
      // Check for high-risk users
      const highRiskUsers = userStats.filter(user => user.violations > 3);
      highRiskUsers.forEach(user => {
        threats.push({
          type: 'high_risk_user',
          severity: 'high',
          description: `User ${user.userId} has ${user.violations} violations`,
          userId: user.userId,
          violations: user.violations
        });
      });
      
      threats.forEach(threat => {
        this.logger.log('error', `Security threat detected: ${threat.type}`, {
          threat: threat.type,
          severity: threat.severity,
          description: threat.description,
          details: threat
        });
        
        this.monitoringData.threats.push({
          timestamp: new Date().toISOString(),
          type: 'threat_detected',
          threat: threat.type,
          severity: threat.severity,
          description: threat.description
        });
      });
    } catch (error) {
      console.error('Threat analysis error:', error);
    }
  }

  /**
   * Generate security alerts
   */
  generateSecurityAlerts() {
    const alerts = [];
    
    // Check alert thresholds
    const highSeverityEvents = this.monitoringData.events.filter(event => 
      event.severity === 'high'
    ).length;
    
    if (highSeverityEvents >= this.options.alertThresholds.highSeverity) {
      alerts.push({
        type: 'high_severity_threshold',
        severity: 'high',
        message: `High severity events threshold exceeded: ${highSeverityEvents}`,
        count: highSeverityEvents,
        threshold: this.options.alertThresholds.highSeverity
      });
    }
    
    // Check for recent anomalies
    const recentAnomalies = this.monitoringData.anomalies.filter(anomaly => {
      const anomalyTime = new Date(anomaly.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return anomalyTime > oneHourAgo;
    });
    
    if (recentAnomalies.length > 0) {
      alerts.push({
        type: 'recent_anomalies',
        severity: 'medium',
        message: `${recentAnomalies.length} anomalies detected in the last hour`,
        count: recentAnomalies.length,
        anomalies: recentAnomalies
      });
    }
    
    // Check for recent threats
    const recentThreats = this.monitoringData.threats.filter(threat => {
      const threatTime = new Date(threat.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return threatTime > oneHourAgo;
    });
    
    if (recentThreats.length > 0) {
      alerts.push({
        type: 'recent_threats',
        severity: 'high',
        message: `${recentThreats.length} threats detected in the last hour`,
        count: recentThreats.length,
        threats: recentThreats
      });
    }
    
    return alerts;
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      timestamp: new Date().toISOString(),
      monitoring: {
        realTime: this.options.enableRealTimeMonitoring,
        anomalyDetection: this.options.enableAnomalyDetection,
        threatIntelligence: this.options.enableThreatIntelligence
      },
      data: {
        events: this.monitoringData.events.length,
        anomalies: this.monitoringData.anomalies.length,
        threats: this.monitoringData.threats.length,
        alerts: this.monitoringData.alerts.length
      },
      alerts: this.generateSecurityAlerts()
    };
  }

  /**
   * Get security recommendations
   */
  getSecurityRecommendations() {
    const recommendations = [];
    const status = this.getMonitoringStatus();
    
    // High severity events
    if (status.alerts.some(alert => alert.severity === 'high')) {
      recommendations.push({
        type: 'immediate_action',
        priority: 'high',
        title: 'Immediate Security Action Required',
        description: 'High severity security events detected',
        action: 'Review security logs and take immediate action'
      });
    }
    
    // Anomalies detected
    if (status.data.anomalies > 0) {
      recommendations.push({
        type: 'investigation',
        priority: 'medium',
        title: 'Security Anomalies Detected',
        description: `${status.data.anomalies} security anomalies detected`,
        action: 'Investigate anomalies and review security policies'
      });
    }
    
    // Threats detected
    if (status.data.threats > 0) {
      recommendations.push({
        type: 'threat_response',
        priority: 'high',
        title: 'Security Threats Detected',
        description: `${status.data.threats} security threats detected`,
        action: 'Implement threat response procedures'
      });
    }
    
    return recommendations;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('Stopping security monitoring...');
    // Clear intervals and cleanup
    this.monitoringData = {
      events: [],
      anomalies: [],
      threats: [],
      alerts: []
    };
  }
}

/**
 * Factory function to create security monitoring
 */
const createSecurityMonitoring = (options = {}) => {
  return new SecurityMonitoring(options);
};

module.exports = {
  SecurityMonitoring,
  createSecurityMonitoring
};
