// src/utils/toast.ts
import { toast, ToastOptions } from "react-toastify";
import { ReactNode } from "react";

// Optional: Define global default options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: ReactNode, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: ReactNode, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: ReactNode, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: ReactNode, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
};
