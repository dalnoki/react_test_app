import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import axios from "axios";
import { useSentryToolbar } from "@sentry/toolbar";
import { logInfo, logError, logWarn, logDebug, client, scope } from "./cccc.js";


const App = () => {
  const [replayActive, setReplayActive] = useState(false);
  const [user, setUser] = useState("john.doe@example.com");

  useSentryToolbar({
    // Remember to conditionally enable the Toolbar.
    // This will reduce network traffic for users
    // who do not have credentials to login to Sentry.

    initProps: {
      organizationSlug: "kismeow",
      projectIdOrSlug: "4505244102426624",
    },
  });

  function throwSyntaxError() {
    Sentry.captureException(new SyntaxError("This is a syntax error"), {
      tags: {
        error_code: 500,
      },
    });
    throw new SyntaxError("This is a syntax error");
  }

  const causeHttpError = async () => {
    try {
      // Make a request to a URL that will (intentionally) fail
      const response = await fetch("https://httpstat.us/404"); // or any failing endpoint

      if (!response.ok) {
        // Throwing here lets Sentry capture the error with mechanism:http.client
        Sentry.captureException(
          new Error(`HTTP error! Status: ${response.status}`),
          {
            tags: {
              error_code: 500,
            },
          }
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If success, parse the JSON
      const data = await response.json();
      console.log("Data received:", data);
    } catch (error) {
      // Re-throw the error to let Sentry capture it via fetch instrumentation
      Sentry.captureException(error, {
        tags: {
          error_code: 500,
        },
      });
      throw error;
    }
  };

  async function ThrowFailedFetchError() {
    const response = await fetch(
      "https://example.com/this-endpoint-does-not-exist"
    );

    if (!response.ok) {
      Sentry.captureException(
        new Error(`Fetch failed: ${response.status} ${response.statusText}`),
        {
          tags: {
            error_code: 500,
          },
        }
      );
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return (
      <div>
        <h1>Data Fetched Successfully</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  function throwObject() {
    Sentry.captureException(new Error("Throwing object"), {
      tags: {
        error_code: 500,
      },
    });
    throw { error: "foo" };
  }

  function throwUriError() {
    Sentry.captureException(new URIError("This is a URI error"), {
      tags: {
        error_code: 500,
      },
    });
    throw new URIError("This is a URI error");
  }

  // Function to handle non-error promise rejection
  function handleNonErrorRejection() {
    Promise.reject({
      message: "This is a non-error rejection",
      code: 500,
    }).catch((reason) => {
      console.error("Caught non-error rejection:", reason);
      Sentry.captureException(new Error("Non-error promise rejection"), {
        extra: reason,
        tags: {
          error_code: 500,
        },
      });
    });
  }

  function triggerAxiosError() {
    const url = "https://example.com/api/nonexistent-endpoint";
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    axios
      .get(url, config)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        Sentry.captureException(
          new Error("Simulated error: Axios request failed."),
          {
            tags: {
              error_code: 500,
            },
          }
        );
        throw new Error("Simulated error: Axios request failed.");
      });
  }

  function throwReferenceError() {
    Sentry.captureException(new ReferenceError("Attempting to access undefined variable"), {
      tags: {
        error_code: 500,
      },
    });
    // This will throw a ReferenceError
    console.log(nonExistentVariable);
  }

  // CCCC.js test functions
  function testCcccBasicEvent() {
    scope.captureEvent({
      message: "Test event from cccc.js scope",
      level: "info",
    });
    console.log("✅ Basic event captured via cccc.js scope");
  }

  function testCcccClientEvent() {
    client.captureEvent({
      message: "Test event from cccc.js client",
      level: "info",
    });
    console.log("✅ Client event captured via cccc.js client");
  }

  function testCcccException() {
    try {
      throw new Error("Test exception from cccc.js");
    } catch (error) {
      scope.captureException(error);
      console.log("✅ Exception captured via cccc.js scope");
    }
  }

  function testCcccLogInfo() {
    logInfo("Test info log from cccc.js", {
      testId: "cccc-info-test",
      timestamp: new Date().toISOString(),
      user: "test-user"
    });
    console.log("✅ Info log sent via cccc.js");
  }

  function testCcccLogError() {
    logError("Test error log from cccc.js", new Error("Simulated error"), {
      testPhase: "cccc-testing",
      severity: "medium"
    });
    console.log("✅ Error log sent via cccc.js");
  }

  function testCcccLogWarn() {
    logWarn("Test warning log from cccc.js", {
      warningType: "performance",
      threshold: "80%",
      currentValue: "75%"
    });
    console.log("✅ Warning log sent via cccc.js");
  }

  function testCcccLogDebug() {
    logDebug("Test debug log from cccc.js", {
      debugInfo: "Processing step 3",
      dataSize: 2048,
      operation: "data-transformation"
    });
    console.log("✅ Debug log sent via cccc.js");
  }

  function testCcccStructuredData() {
    logInfo("User interaction captured", {
      action: "button_click",
      buttonId: "cccc-test-button",
      userId: "user-123",
      sessionId: "session-456",
      timestamp: Date.now(),
      metadata: {
        browser: navigator.userAgent,
        url: window.location.href
      }
    });
    console.log("✅ Structured data log sent via cccc.js");
  }

  // Function to start replay buffering
  const startReplay = async () => {
    const replay = Sentry.getReplay();
    if (replay) {
      replay.startBuffering();
      console.log("Replay buffering started");
      setReplayActive(true);
      throwSyntaxError();
      replay.flush();
    } else {
      console.log("Sentry Replay instance not available");
    }
  };

  // Function to stop replay and clear the session
  const stopReplay = async () => {
    const replay = Sentry.getReplay();
    if (replay) {
      await replay.flush();
      console.log("Replay stopped and session ended");
      setReplayActive(false);
    } else {
      console.log("Sentry Replay instance not available");
    }
  };

  // Function to change the user
  const changeUser = async () => {
    const replay = Sentry.getReplay();
    if (replay) {
      await replay.stop();
    }
    const newUser =
      user === "john.doe@example.com"
        ? "jane.doe@example.com"
        : "john.doe@example.com";
    Sentry.setUser({ email: newUser });
    console.log(`User changed to: ${newUser}`);
    setUser(newUser);

    // Clear the current context to reset the session
  };

  return (
    <div className="App">
      <div style={styles.container}>
        <button style={styles.button} onClick={throwSyntaxError}>
          Throw Syntax Error
        </button>
        <button style={styles.button} onClick={ThrowFailedFetchError}>
          Throw Failed Fetch Error
        </button>
        <button style={styles.button} onClick={causeHttpError}>
          Throw HTTP Error
        </button>
        <button style={styles.button} onClick={throwObject}>
          Throw Object
        </button>
        <button style={styles.button} onClick={throwUriError}>
          Throw URI Error
        </button>
        <button style={styles.button} onClick={handleNonErrorRejection}>
          Throw Non-Error Rejection
        </button>
        <button style={styles.button} onClick={startReplay}>
          Start Replay
        </button>
        <button style={styles.button} onClick={stopReplay}>
          Stop Replay
        </button>
        <button style={styles.button} onClick={changeUser}>
          Change User
        </button>
        <button style={styles.button} onClick={triggerAxiosError}>
          Trigger Axios error
        </button>
        <button style={styles.button} onClick={throwReferenceError}>
          Throw Reference Error
        </button>
        
        {/* CCCC.js Test Buttons */}
        <div style={{ marginTop: "30px", borderTop: "2px solid #ccc", paddingTop: "20px" }}>
          <h3>CCCC.js Tests</h3>
          <button style={styles.button} onClick={testCcccBasicEvent}>
            Test CCCC Basic Event
          </button>
          <button style={styles.button} onClick={testCcccClientEvent}>
            Test CCCC Client Event
          </button>
          <button style={styles.button} onClick={testCcccException}>
            Test CCCC Exception
          </button>
          <button style={styles.button} onClick={testCcccLogInfo}>
            Test CCCC Log Info
          </button>
          <button style={styles.button} onClick={testCcccLogError}>
            Test CCCC Log Error
          </button>
          <button style={styles.button} onClick={testCcccLogWarn}>
            Test CCCC Log Warn
          </button>
          <button style={styles.button} onClick={testCcccLogDebug}>
            Test CCCC Log Debug
          </button>
          <button style={styles.button} onClick={testCcccStructuredData}>
            Test CCCC Structured Data
          </button>
        </div>
      </div>
    </div>
  );
};

// Some simple inline styles for the app
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default App;
