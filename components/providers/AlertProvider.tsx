"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import AlertComponent from "@/components/ui/Alert";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertContextProps {
  showAlert: (type: AlertType, title: string, description: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{
    type: AlertType;
    title: string;
    description: string;
  } | null>(null);

  const showAlert = (type: AlertType, title: string, description: string) => {
    setAlert({ type, title, description });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-6 right-6 max-w-sm z-50">
          <AlertComponent
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
};
