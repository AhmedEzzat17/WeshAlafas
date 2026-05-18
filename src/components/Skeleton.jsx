import { useLanguage } from "../context/LanguageContext";

export default function Skeleton({ width, height, borderRadius = "12px", className = "" }) {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width || "100%",
        height: height || "20px",
        borderRadius,
        background: "#F1F5F9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 12, border: "1px solid #E2E8F0" }}>
      <Skeleton height="180px" borderRadius="12px" style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height="16px" style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height="14px" style={{ marginBottom: 12 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width="30%" height="20px" />
        <Skeleton width="24px" height="24px" borderRadius="50%" />
      </div>
    </div>
  );
}
