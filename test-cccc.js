// Test file for cccc.js functionality
import {
  client,
  scope,
  logInfo,
  logError,
  logWarn,
  logDebug
} from './cccc.js';

console.log('🧪 Testing cccc.js functionality...');

// Test 1: Basic event capture
console.log('📝 Test 1: Basic event capture');
scope.captureEvent({
  message: "Test event from scope",
  level: "info",
});

// Test 2: Client event capture
console.log('📝 Test 2: Client event capture');
client.captureEvent({
  message: "Test event from client",
  level: "info",
});

// Test 3: Exception capture
console.log('📝 Test 3: Exception capture');
try {
  throw new Error("Test exception for cccc.js");
} catch (error) {
  scope.captureException(error);
}

// Test 4: Helper logging functions
console.log('📝 Test 4: Helper logging functions');

logInfo("Application test started", { 
  testId: "cccc-test-001",
  timestamp: new Date().toISOString()
});

logDebug("Processing test data", { 
  dataSize: 1024,
  operation: "test-processing"
});

logWarn("Test warning - high memory usage", { 
  memoryUsage: "75%",
  threshold: "70%"
});

logError("Test error occurred", new Error("Simulated test error"), {
  testPhase: "validation",
  userId: "test-user-123"
});

// Test 5: Structured data logging
console.log('📝 Test 5: Structured data logging');
logInfo("User action performed", {
  action: "button_click",
  buttonId: "test-button",
  userId: "user-456",
  sessionId: "session-789",
  timestamp: Date.now()
});

// Test 6: Error with context
console.log('📝 Test 6: Error with context');
try {
  // Simulate an API call error
  const response = { status: 404, message: "Not found" };
  if (response.status !== 200) {
    throw new Error(`API Error: ${response.status} - ${response.message}`);
  }
} catch (error) {
  logError("API call failed", error, {
    endpoint: "/api/test",
    method: "GET",
    statusCode: 404,
    retryCount: 0
  });
}

console.log('✅ All cccc.js tests completed! Check Sentry dashboard for results.'); 