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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertClasses = () => {
    const baseClasses = "border-primary/30 bg-background-subtle text-foreground-accent shadow-elegant relative";
    return `${baseClasses} ${className}`;
  };

  return (
    <Alert className={getAlertClasses()}>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-foreground-muted hover:text-primary transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      {getIcon()}
      <AlertTitle className="text-primary font-semibold pr-6">{title}</AlertTitle>
      <AlertDescription className="text-foreground-muted">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
