import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  maxWidth = '300px',
  showOnEllipsis = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const tooltipRef = useRef(null);
  const targetRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check if text is truncated (has ellipsis)
  const checkEllipsis = (element) => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth || 
           element.scrollHeight > element.clientHeight;
  };

  // Check if content has multiple lines and is truncated
  const checkMultiLineEllipsis = (element) => {
    if (!element) return false;
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const maxHeight = parseFloat(computedStyle.maxHeight);
    const actualHeight = element.scrollHeight;
    
    // If maxHeight is set and content exceeds it, show tooltip
    if (maxHeight && actualHeight > maxHeight) {
      return true;
    }
    
    // Check if content would wrap to more than 2 lines
    if (lineHeight && maxHeight) {
      const maxLines = Math.floor(maxHeight / lineHeight);
      const actualLines = Math.ceil(actualHeight / lineHeight);
      return actualLines > maxLines;
    }
    
    return false;
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (showOnEllipsis) {
        const element = targetRef.current;
        const hasEllipsis = checkEllipsis(element) || checkMultiLineEllipsis(element);
        setShouldShow(hasEllipsis);
      } else {
        setShouldShow(true);
      }
      
      if (shouldShow) {
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setShouldShow(false);
  };

  const handleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setShouldShow(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipPosition = () => {
    if (!tooltipRef.current || !targetRef.current) return {};

    const tooltip = tooltipRef.current;
    const target = targetRef.current;
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top, left;

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
    }

    // Adjust if tooltip goes off screen
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 8) {
      top = rect.bottom + 8; // Show below instead
    }
    if (top + tooltipRect.height > viewport.height - 8) {
      top = rect.top - tooltipRect.height - 8; // Show above instead
    }

    return { top, left };
  };

  const tooltipStyle = isVisible ? getTooltipPosition() : {};

  return (
    <div className={`tooltip-wrapper ${className}`}>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="tooltip-target"
      >
        {children}
      </div>
      
      {isVisible && shouldShow && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${position}`}
          style={{
            ...tooltipStyle,
            maxWidth,
            position: 'fixed',
            zIndex: 9999
          }}
        >
          <div className="tooltip-content">
            {content}
          </div>
          <div className={`tooltip-arrow tooltip-arrow-${position}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
