"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  className?: string;
}

const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  className = ""
}: DialogProps) => {
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // Slower transition for premium feel
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  if (!isOpen) return null;

  const getDialogClasses = () => {
    const baseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4";
    return `${baseClasses} ${className}`;
  };

  const getOverlayClasses = () => {
    const baseClasses = "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out";
    return isClosing ? "opacity-0" : "opacity-100";
  };

  const getContentClasses = () => {
    const baseClasses = "relative bg-background border border-primary/20 rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-500 ease-in-out transform";
    const variantClasses = variant === "destructive" 
      ? "border-red-500/30" 
      : "border-primary/20";
    const animationClasses = isClosing 
      ? "scale-95 opacity-0" 
      : "scale-100 opacity-100";
    
    return `${baseClasses} ${variantClasses} ${animationClasses}`;
  };

  const getConfirmButtonClasses = () => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-500 ease-in-out transform hover:scale-105";
    const variantClasses = variant === "destructive"
      ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/25"
      : "bg-primary text-primary-foreground hover:bg-primary-dark shadow-gold";
    
    return `${baseClasses} ${variantClasses}`;
  };

  return (
    <div className={getDialogClasses()}>
      {/* Overlay */}
      <div 
        className={getOverlayClasses()}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Dialog Content */}
      <div className={getContentClasses()} role="dialog" aria-modal="true">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary/10 transition-colors duration-200"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4 text-foreground-muted hover:text-foreground" />
        </button>
        
        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {title}
            </h3>
          </div>
          
          <p className="text-foreground-muted leading-relaxed">
            {description}
          </p>
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md font-medium bg-background-subtle border border-primary/20 text-foreground hover:bg-primary/10 transition-all duration-200 transform hover:scale-105"
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleConfirm}
              className={getConfirmButtonClasses()}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
