import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as Sentry from "@sentry/react";

// Initialize Sentry with official React configuration
Sentry.init({
  dsn: "https://6834d360de7f4013a7b0556a730e6d31@o4504973214810112.ingest.us.sentry.io/4505244102426624",
  debug: true,
  sendDefaultPii: false,
  beforeSend: (event, hint) => {
    console.log(event);
    return event;
  },
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment and release
  environment: "cica",
  release: "kiskutya",
  
  // Integrations for React
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional replay configuration
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// Export client and scope for custom functionality
export const client = Sentry.getClient();
export const scope = Sentry.getCurrentScope();

// Function to add error context attachment
const addErrorAttachment = () => {
  Sentry.getCurrentScope().addAttachment({
    filename: "error-context.txt",
    data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  });
};

// Function to clear all attachments
export const clearAttachments = () => {
  Sentry.getCurrentScope().clearAttachments();
};

Sentry.setTag("type", "test1 test2");

// Add an attachment

// Clear attachments
Sentry.getCurrentScope().clearAttachments();

// Test logging
Sentry.captureEvent({
  message: "Test event",
  level: "info",
});

// Alternative way to capture events
Sentry.captureEvent({
  message: "Test event 2",
  level: "info",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Add relevant attachments when an error occurs
    Sentry.getCurrentScope().addAttachment({
      filename: "error-info.json",
      data: JSON.stringify(errorInfo),
    });
    
    Sentry.captureException(error);
  }
  
  render() {
    return this.props.children;
  }
}

