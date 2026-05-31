import { useLanguage } from "../context/LanguageContext";

export default function Skeleton({ width, height, borderRadius = "12px", className = "", style = {} }) {
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
        ...style
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
            rgba(255, 255, 255, 0.4) 30%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 70%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 1.5s infinite linear;
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
    <div style={{ background: "#fff", borderRadius: 16, padding: 12, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <Skeleton height="180px" borderRadius="12px" style={{ marginBottom: 16 }} />
      <Skeleton width="40%" height="12px" style={{ marginBottom: 10 }} />
      <Skeleton width="80%" height="18px" style={{ marginBottom: 10 }} />
      <Skeleton width="60%" height="14px" style={{ marginBottom: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
        <Skeleton width="40%" height="24px" />
        <Skeleton width="32px" height="32px" borderRadius="50%" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div style={{ padding: "16px", maxWidth: "1920px", margin: "0 auto" }}>
      <Skeleton height="clamp(300px, 40vw, 500px)" borderRadius="24px" />
    </div>
  );
}

export function SectionTitleSkeleton() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: 24, maxWidth: "1920px", margin: "0 auto 24px" }}>
      <Skeleton width="200px" height="32px" borderRadius="8px" />
      <Skeleton width="100px" height="24px" borderRadius="16px" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #e5e7eb" }}>
      <Skeleton height="220px" borderRadius="0" />
      <div style={{ padding: "20px 24px 24px" }}>
        <Skeleton width="60%" height="24px" style={{ marginBottom: 12 }} />
        <Skeleton width="90%" height="14px" style={{ marginBottom: 6 }} />
        <Skeleton width="70%" height="14px" style={{ marginBottom: 16 }} />
        <Skeleton width="40%" height="16px" />
      </div>
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ececec", padding: 24 }}>
      <Skeleton width="40%" height="24px" style={{ marginBottom: 24 }} />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ marginBottom: 24 }}>
          <Skeleton width="30%" height="20px" style={{ marginBottom: 16 }} />
          {[1, 2, 3].map(j => (
            <div key={j} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <Skeleton width="20px" height="20px" borderRadius="6px" />
              <Skeleton width="60%" height="20px" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div style={{ background: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)", borderRadius: 24, padding: 32, marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Skeleton width="80px" height="80px" borderRadius="50%" style={{ marginBottom: 16 }} />
      <Skeleton width="150px" height="28px" style={{ marginBottom: 8 }} />
      <Skeleton width="200px" height="16px" style={{ marginBottom: 16 }} />
      <Skeleton width="120px" height="32px" borderRadius="20px" />
    </div>
  );
}

export function ProfileMenuSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#fff", borderRadius: 20, border: "1px solid #f3f4f6" }}>
          <Skeleton width="52px" height="52px" borderRadius="14px" />
          <div style={{ flex: 1 }}>
            <Skeleton width="70%" height="18px" style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckoutFormSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 24, border: "1px solid #f3f4f6" }}>
        <Skeleton width="30%" height="24px" style={{ marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <Skeleton width="20%" height="14px" style={{ marginBottom: 8 }} />
            <Skeleton height="50px" borderRadius="12px" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Skeleton width="25%" height="14px" style={{ marginBottom: 8 }} />
            <Skeleton height="50px" borderRadius="12px" />
          </div>
          <div>
            <Skeleton width="30%" height="14px" style={{ marginBottom: 8 }} />
            <Skeleton height="50px" borderRadius="12px" />
          </div>
          <div>
            <Skeleton width="30%" height="14px" style={{ marginBottom: 8 }} />
            <Skeleton height="50px" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSummarySkeleton() {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 24, border: "1px solid #f3f4f6" }}>
      <Skeleton width="40%" height="24px" style={{ marginBottom: 24 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <Skeleton width="60px" height="60px" borderRadius="12px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="80%" height="16px" style={{ marginBottom: 8 }} />
              <Skeleton width="30%" height="14px" style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height="16px" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
        <Skeleton width="100%" height="20px" style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height="20px" style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height="28px" style={{ marginTop: 12 }} />
        <Skeleton width="100%" height="52px" borderRadius="14px" style={{ marginTop: 24 }} />
      </div>
    </div>
  );
}

export function ContactFormSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Skeleton width="40%" height="32px" style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height="16px" style={{ marginBottom: 24 }} />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <Skeleton width="30%" height="14px" style={{ marginBottom: 8 }} />
          <Skeleton height="50px" borderRadius="14px" />
        </div>
        <div>
          <Skeleton width="30%" height="14px" style={{ marginBottom: 8 }} />
          <Skeleton height="50px" borderRadius="14px" />
        </div>
      </div>
      <div>
        <Skeleton width="20%" height="14px" style={{ marginBottom: 8 }} />
        <Skeleton height="50px" borderRadius="14px" />
      </div>
      <div>
        <Skeleton width="15%" height="14px" style={{ marginBottom: 8 }} />
        <Skeleton height="120px" borderRadius="14px" />
      </div>
      <Skeleton height="52px" borderRadius="14px" style={{ marginTop: 8 }} />
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 32px", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
      <div style={{ flex: "1 1 45%", paddingTop: 16 }}>
        <Skeleton width="100px" height="18px" style={{ marginBottom: 12 }} />
        <Skeleton width="80%" height="48px" style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height="18px" style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height="18px" style={{ marginBottom: 8 }} />
        <Skeleton width="85%" height="18px" style={{ marginBottom: 32 }} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Skeleton width="52px" height="52px" borderRadius="12px" />
              <Skeleton width="60%" height="20px" />
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: "1 1 45%", position: "relative", minHeight: 380 }}>
        <Skeleton height="350px" borderRadius="16px" style={{ width: "82%", marginLeft: "auto" }} />
        <Skeleton height="220px" borderRadius="16px" style={{ width: "62%", position: "absolute", bottom: -20, left: -20, border: "6px solid #fff" }} />
      </div>
    </div>
  );
}
