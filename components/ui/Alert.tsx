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
        return <CheckCircle className="h-5 w-5 text-primary drop-shadow-glow" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-primary" />;
    }
  };

  const getVariant = () => {
    if (type === "error") return "destructive";
    if (type === "success") return "gold";
    return "default";
  };

  return (
    <Alert variant={getVariant()} className={className}>
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-foreground-muted hover:text-primary transition-all duration-300 hover:rotate-90"
      >
        <X className="h-5 w-5" />
      </button>
      {getIcon()}
      <AlertTitle className="text-primary font-serif font-bold text-lg tracking-wide pr-8 mb-2">
        {title}
      </AlertTitle>
      <AlertDescription className="text-foreground-muted/80 text-sm italic font-light">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
