import axios, { AxiosError, AxiosResponse } from "axios";
import { useToastController } from "@tamagui/toast";
import { useFormErrors } from "@/contexts/FormErrorContext";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a function that can be called to set up the interceptors
// We need this to be a function because we need to access React hooks
export const setupInterceptors = (
  showToast: (
    message: string,
    type: "error" | "success" | "warning" | "info"
  ) => void,
  setFieldErrors: (errors: Record<string, string[]>) => void
) => {
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // If the response has a success message, show it
      if (response.data?.message) {
        showToast(response.data.message, "success");
      }
      return response;
    },
    (error: AxiosError) => {
      // Clear field errors on each new request
      setFieldErrors({});

      // Handle different error responses
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data as any;

        // Handle validation errors (422)
        if (status === 422 && data.errors) {
          // Set field errors for form fields
          setFieldErrors(data.errors);

          // Create a generic message from validation errors
          const errorMessage =
            data.message || "Validation error. Please check your input.";
          showToast(errorMessage, "error");
        }
        // Handle other error types
        else {
          const errorMessage =
            data.message || "An error occurred. Please try again.";
          showToast(errorMessage, "error");
        }
      } else if (error.request) {
        // The request was made but no response was received
        showToast(
          "No response from server. Please check your connection.",
          "error"
        );
      } else {
        // Something happened in setting up the request
        showToast("Request error. Please try again.", "error");
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
