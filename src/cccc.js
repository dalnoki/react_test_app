import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from "@sentry/browser";

// filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(
    defaultIntegration.name
  );
});

const client = new BrowserClient({
  dsn: "https://6834d360de7f4013a7b0556a730e6d31@o4504973214810112.ingest.us.sentry.io/4505244102426624",
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
  debug: true,
  _experiments: { enableLogs: true },
});

const scope = new Scope();
scope.setClient(client);

client.init(); // initializing has to be done after setting the client on the scope

// You can capture exceptions manually for this client like this:
scope.captureException(new Error("example"));

// Test logging - Fixed for shared environment setup
scope.captureEvent({
  message: "Test log",
  level: "info",
  extra: { data: "Some data" }
});

scope.captureEvent({
  message: "Test event",
  level: "info",
});

// Alternative way to capture events
client.captureEvent({
  message: "Test event 2",
  level: "info",
});

// Helper function for structured logging in shared environment
export const logInfo = (message, data = {}) => {
  scope.captureEvent({
    message,
    level: "info",
    extra: data
  });
};

export const logError = (message, error = null, data = {}) => {
  if (error) {
    scope.captureException(error);
  }
  scope.captureEvent({
    message,
    level: "error",
    extra: data
  });
};

export const logWarn = (message, data = {}) => {
  scope.captureEvent({
    message,
    level: "warning",
    extra: data
  });
};

export const logDebug = (message, data = {}) => {
  scope.captureEvent({
    message,
    level: "debug",
    extra: data
  });
};
