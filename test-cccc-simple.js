// Simple test script for cccc.js
// Run this with: node test-cccc-simple.js

// Mock browser environment for Node.js testing
global.window = {
  location: { href: 'http://localhost:3000' }
};
global.navigator = {
  userAgent: 'Mozilla/5.0 (Test Browser)'
};

// Import cccc.js functionality
const { logInfo, logError, logWarn, logDebug, client, scope } = require('./cccc.js');

console.log('🧪 Starting cccc.js tests...\n');

// Test 1: Basic logging
console.log('📝 Test 1: Basic logging functions');
logInfo("Test info message", { testId: "001", timestamp: new Date().toISOString() });
logDebug("Test debug message", { debugData: "sample" });
logWarn("Test warning message", { warningLevel: "medium" });
logError("Test error message", new Error("Test error"), { errorCode: "TEST001" });

// Test 2: Event capture
console.log('\n📝 Test 2: Event capture');
scope.captureEvent({
  message: "Test event from scope",
  level: "info",
  extra: { source: "test-script" }
});

client.captureEvent({
  message: "Test event from client",
  level: "info",
  extra: { source: "test-script" }
});

// Test 3: Exception capture
console.log('\n📝 Test 3: Exception capture');
try {
  throw new Error("Test exception for cccc.js");
} catch (error) {
  scope.captureException(error);
}

// Test 4: Structured data
console.log('\n📝 Test 4: Structured data logging');
logInfo("User action", {
  action: "test_click",
  userId: "test-user-123",
  sessionId: "session-456",
  metadata: {
    browser: "test-browser",
    url: "http://localhost:3000"
  }
});

// Test 5: Error with context
console.log('\n📝 Test 5: Error with context');
try {
  const response = { status: 500, message: "Internal server error" };
  if (response.status >= 400) {
    throw new Error(`HTTP Error: ${response.status} - ${response.message}`);
  }
} catch (error) {
  logError("API call failed", error, {
    endpoint: "/api/test",
    method: "POST",
    statusCode: 500,
    retryAttempts: 3
  });
}

console.log('\n✅ All cccc.js tests completed!');
console.log('📊 Check your Sentry dashboard to see the captured events and logs.');
console.log('🔍 Look for events with messages starting with "Test" to find your test data.'); 