import React, { useEffect } from "react";
import { useToastController } from "@tamagui/toast";
import { useFormErrors } from "./FormErrorContext";
import { setupInterceptors } from "@/api";

export const APIInterceptorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const toast = useToastController();
  const { setFieldErrors } = useFormErrors();

  // Show toast helper function
  const showToast = (
    message: string,
    type: "error" | "success" | "warning" | "info"
  ) => {
    toast.show(message, {
      duration: 5000,
      variant: type,
    });
  };

  useEffect(() => {
    // Set up the API interceptors
    setupInterceptors(showToast, setFieldErrors);
  }, []);

  return <>{children}</>;
};
