"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/base-alert";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface AlertProps {
  title: string;
  description: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const AlertComponent = ({
  title,
  description,
  type = "success",
  duration = 5000,
  onClose,
  className = ""
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 50);
    
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleLeave();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isVisible]);

  const handleLeave = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const handleClose = () => {
    handleLeave();
  };

  if (!isVisible && !isLeaving) return null;

  const getIcon = () => {
    const iconClass = "h-5 w-5 flex-shrink-0";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-primary`} />;
      case "error":
        return <AlertCircle className={`${iconClass} text-destructive`} />;
      case "warning":
        return <AlertCircle className={`${iconClass} text-amber-500`} />;
      case "info":
        return <Info className={`${iconClass} text-blue-500`} />;
      default:
        return <CheckCircle className={`${iconClass} text-primary}`} />;
    }
  };

  const getAlertClasses = () => {
    const baseClasses = "relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ease-out border-primary/30 bg-background-subtle text-foreground-accent";
    const animationClasses = isVisible && !isLeaving 
      ? "translate-x-0 opacity-100 scale-100" 
      : "translate-x-full opacity-0 scale-95";
    
    return `${baseClasses} ${animationClasses} ${className}`;
  };

  return (
    <Alert className={getAlertClasses()}>
      {/* Progress bar */}
      {duration > 0 && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-100 linear"
          style={{
            animation: isVisible && !isLeaving ? `shrink ${duration}ms linear` : 'none'
          }}
        />
      )}
      
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="h-4 w-4 opacity-70 hover:opacity-100" />
      </button>
      
      {/* Content */}
      <div className="flex items-start gap-3 pr-8">
        <div className="animate-pulse">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <AlertTitle className="font-semibold text-sm mb-1">
            {title}
          </AlertTitle>
          <AlertDescription className="text-sm opacity-90 leading-relaxed">
            {description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default AlertComponent;
