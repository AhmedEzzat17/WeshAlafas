/**
 * useToast.js – Lightweight toast notification hook
 * ===================================================
 * 
 * Provides success/error/info message display without external dependencies.
 * Auto-dismisses after a configurable duration.
 * 
 * WHY: Every API call should give user feedback.  This hook centralises
 * the toast logic so any component can call `showSuccess("Saved!")`.
 * 
 * USAGE:
 *   const { toast, showSuccess, showError, showInfo, ToastContainer } = useToast();
 *   
 *   // In handler:
 *   showSuccess("Crop created!");
 *   
 *   // In JSX:
 *   <ToastContainer />
 */

import { useState, useCallback, useRef } from "react";

const TOAST_DURATION = 4000; // 4 seconds

const TOAST_STYLES = {
  success: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    icon: "✓",
    borderColor: "#34D399",
  },
  error: {
    background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
    icon: "✕",
    borderColor: "#F87171",
  },
  info: {
    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    icon: "ℹ",
    borderColor: "#60A5FA",
  },
};

export default function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = TOAST_DURATION) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, type });
      timerRef.current = setTimeout(dismiss, duration);
    },
    [dismiss]
  );

  const showSuccess = useCallback(
    (msg) => showToast(msg, "success"),
    [showToast]
  );
  const showError = useCallback(
    (msg) => showToast(msg, "error"),
    [showToast]
  );
  const showInfo = useCallback(
    (msg) => showToast(msg, "info"),
    [showToast]
  );

  /**
   * ToastContainer – drop this into your JSX to render toasts.
   * Fixed-position, top-center, above everything.
   */
  const ToastContainer = useCallback(() => {
    if (!toast) return null;

    const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

    return (
      <div
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
          animation: "toastSlideIn 0.35s ease-out",
        }}
      >
        <style>{`
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 24px",
            borderRadius: 14,
            background: style.background,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            border: `1px solid ${style.borderColor}`,
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            minWidth: 280,
            maxWidth: 500,
          }}
          onClick={dismiss}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {style.icon}
          </span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          <span
            style={{
              opacity: 0.6,
              fontSize: 18,
              cursor: "pointer",
              padding: "0 4px",
            }}
          >
            ×
          </span>
        </div>
      </div>
    );
  }, [toast, dismiss]);

  return { toast, showSuccess, showError, showInfo, dismiss, ToastContainer };
}
