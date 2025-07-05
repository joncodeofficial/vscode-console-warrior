export const injectionCode = `
<script>
(function() {
  var originalConsoleLog = console.log;
  var messageQueue = [];
  var ws = null;
  const ansiRegex = /\\x1b\\[[0-9;]*m/g;
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'];

  // Parses the stack trace to extract the file, line, and column info
  function getStackInfo() {
    try {
      const stack = Error().stack;
      const stackLines = stack.split("\\n");

      // Detect Firefox stack trace format
      const isFirefox = stackLines.some(line => line.includes('@') && !line.includes('at '));

      if (isFirefox) {
        // Format: "function@file:line:column" or "@file:line:column"
        for (let i = 1; i < stackLines.length; i++) {
          const line = stackLines[i].trim();

          if (!extensions.some(ext => line.includes(ext))) continue;

          const match = line.match(/^.*@(.*\\.(js|ts|jsx|tsx|vue|svelte)(?:\\?[^:]*)??):(\\d+):(\\d+)$/);
          if (match) {
            return {
              url: match[1],
              line: parseInt(match[3]),
              column: parseInt(match[4])
            };
          }
        }
      } else {
        // Chrome/Safari format: "at function (file:line:column)"
        for (let i = 1; i < stackLines.length; i++) {
          const line = stackLines[i];

          if (!extensions.some(ext => line.includes(ext))) continue;

          // Pattern with parentheses
          let match = line.match(/\\s+at\\s+[^(]*\\(([^)]+\\.(js|ts|jsx|tsx|vue|svelte)(?:\\?[^:)]+)?):(\\d+):(\\d+)\\)/);
          if (match) {
            return {
              url: match[1],
              line: parseInt(match[3]),
              column: parseInt(match[4])
            };
          }

          // Pattern without parentheses
          match = line.match(/\\s+at\\s+([^\\s]+\\.(js|ts|jsx|tsx|vue|svelte)(?:\\?[^:]+)?):(\\d+):(\\d+)/);
          if (match) {
            return {
              url: match[1],
              line: parseInt(match[3]),
              column: parseInt(match[4])
            };
          }
        }
      }

      return null;
    } catch (e) {
      originalConsoleLog('Error parsing stack:', e);
      return null;
    }
  }

  // Sends queued messages once WebSocket is ready
  function flushQueue() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      while (messageQueue.length > 0) {
        ws.send(JSON.stringify(messageQueue.shift()));
      }
    }
  }

  // Recursively formats objects and arrays for display
  function prettyPrint(value, indent = 2) {
    const spacing = " ".repeat(indent);
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      const items = value.map(item => spacing + prettyPrint(item, indent + 2));
      return "[\\n" + items.join(",\\n") + " ]";
    } else if (typeof value === "function") {
      return "function";
    } else if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value).map(([key, val]) => {
        const formattedKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : \`"\${key}"\`;
        const formattedValue = prettyPrint(val, indent + 2);
        return \`\${spacing}\${formattedKey}: \${formattedValue}\`;
      });
      return "{\\n" + entries.join(",\\n") + " }";
    } else {
      return JSON.stringify(value);
    }
  }

  // Handles serialization of console arguments
  function serializeArg(arg) {
    try {
      return prettyPrint(arg);
    } catch (e) {
      return "[Unserializable]";
    }
  }

  // Establishes a WebSocket connection
  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:9000");

    ws.onopen = function() {
      flushQueue();
    };

    ws.onerror = function(error) {
      // Fail silently
    };

    ws.onclose = function() {
      originalConsoleLog("WebSocket closed, reconnecting in 3s...");
      setTimeout(connectWebSocket, 3000);
    };
  }

  // Override console.log
  console.log = function() {
    // Call original console.log
    originalConsoleLog.apply(console, arguments);

    const args = Array.prototype.slice.call(arguments);
    const location = getStackInfo();

    const logData = {
      type: "client-message",
      message: args.map(serializeArg).join(" "),
      location: location,
      timestamp: new Date().toISOString()
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(logData));
    } else {
      messageQueue.push(logData);
    }
  };

  // Start WebSocket connection
  connectWebSocket();

  // Debug: confirmation of injection
  originalConsoleLog("Console Warrior initialized");
})();
</script>`;
