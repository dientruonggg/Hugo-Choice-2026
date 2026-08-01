export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastDetail {
  message: string;
  type: ToastType;
  duration?: number;
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000) {
  const event = new CustomEvent('hugo-toast', {
    detail: { message, type, duration } as ToastDetail
  });
  window.dispatchEvent(event);
}

// Helper short-hands
export const toast = {
  success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
  error: (msg: string, duration?: number) => showToast(msg, 'error', duration),
  info: (msg: string, duration?: number) => showToast(msg, 'info', duration),
  warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration)
};
