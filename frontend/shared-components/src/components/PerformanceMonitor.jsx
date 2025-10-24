import React, { useEffect, useState } from 'react';

/**
 * Performance monitoring component
 * Tracks and displays performance metrics
 */
const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();

    // Track page load time
    const trackLoadTime = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    // Track memory usage
    const trackMemoryUsage = () => {
      if (performance.memory) {
        const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    // Track render time
    const trackRenderTime = () => {
      const renderTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, renderTime }));
    };

    // Set up performance tracking
    window.addEventListener('load', trackLoadTime);
    window.addEventListener('DOMContentLoaded', trackRenderTime);

    // Track memory usage periodically
    const memoryInterval = setInterval(trackMemoryUsage, 5000);

    // Cleanup
    return () => {
      window.removeEventListener('load', trackLoadTime);
      window.removeEventListener('DOMContentLoaded', trackRenderTime);
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="performance-monitor position-fixed" style={{
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div className="performance-title mb-2">
        <strong>Performance Metrics</strong>
      </div>
      <div className="performance-metrics">
        <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
        <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Bundle: {metrics.bundleSize}KB</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
