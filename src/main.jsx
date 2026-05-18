import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/cairo/300.css";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "./index.css";
import "./utils/i18n"; // Initialize i18next before React renders
import App from "./App.jsx";

import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error }) {
  // Only render the message to avoid gigantic stack traces causing token explosions
  return (
    <div id="error-boundary-box" role="alert" style={{ padding: '2rem', color: 'red', background: '#fee' }}>
      <h2>Something went wrong:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
