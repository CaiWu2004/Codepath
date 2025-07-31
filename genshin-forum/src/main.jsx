import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";

// Initialize the analytics tracking (optional)
const initAnalytics = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === "true") {
    console.log("Analytics initialized");
    // Add your analytics initialization code here
  }
};

// Error handler for uncaught errors
const handleGlobalErrors = (error, info) => {
  console.error("Global error caught:", error, info);
  // You can add error reporting service calls here
};

// Create root
const root = createRoot(document.getElementById("root"));

// Initial render with error handling
try {
  initAnalytics();

  root.render(
    <StrictMode>
      <ErrorBoundary onError={handleGlobalErrors}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error("Fatal error during initialization:", error);
  root.render(
    <div className="p-4 bg-red-100 text-red-800">
      <h1>Application Failed to Load</h1>
      <p>Please refresh the page or try again later.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Refresh Page
      </button>
    </div>
  );
}

// Register service worker in production (optional)
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}
