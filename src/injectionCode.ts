export const injectionCode = `
<script>
(function() {
  var originalConsoleLog = console.log;
  var originalConsoleWarn = console.warn;
  var originalConsoleInfo = console.info;
  var originalConsoleError = console.error;
  var originalConsoleTable = console.table;
  // var originalConsoleTimeEnd = console.timeEnd;
  
  var messageQueue = [];
  var ws = null;
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'];

  /**
   * Parses the stack trace to extract file, line, and column information
   * Supports both Firefox and Chrome/Safari stack trace formats
   */
  function getStackInfo() {
    try {
      const stack = Error().stack;
      const stackLines = stack.split("\\n");

      // Detect Firefox stack trace format vs Chrome/Safari
      // Firefox format: "function@file:line:column" or "@file:line:column"
      // Chrome/Safari format: "at function (file:line:column)"
      const isFirefox = stackLines.some(line => line.includes('@') && !line.includes('at '));

      if (isFirefox) {
        // Process Firefox stack trace format
        for (let i = 1; i < stackLines.length; i++) {
          const line = stackLines[i].trim();

          // Skip lines that don't contain our target file extensions
          if (!extensions.some(ext => line.includes(ext))) continue;

          // Match pattern: anything@file.extension:line:column
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
        // Process Chrome/Safari stack trace format
        for (let i = 1; i < stackLines.length; i++) {
          const line = stackLines[i];

          // Skip lines that don't contain our target file extensions
          if (!extensions.some(ext => line.includes(ext))) continue;

          // Try pattern with parentheses: "at function (file:line:column)"
          let match = line.match(/\\s+at\\s+[^(]*\\(([^)]+\\.(js|ts|jsx|tsx|vue|svelte)(?:\\?[^:)]+)?):(\\d+):(\\d+)\\)/);
          if (match) {
            return {
              url: match[1],
              line: parseInt(match[3]),
              column: parseInt(match[4])
            };
          }

          // Try pattern without parentheses: "at file:line:column"
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

      // Return null if no matching stack frame found
      return null;
    } catch (e) {
      originalConsoleLog('Error parsing stack:', e);
      return null;
    }
  }

  /**
   * Sends all queued messages once WebSocket connection is ready
   * Processes messages in FIFO order
   */
  function flushQueue() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      while (messageQueue.length > 0) {
        ws.send(JSON.stringify(messageQueue.shift()));
      }
    }
  }

  /**
   * Recursively formats objects and arrays for display
   * Creates a pretty-printed representation with proper indentation
   * @param {any} value - The value to format
   * @param {number} indent - Current indentation level (default: 2)
   */
  function prettyPrint(value, indent = 2) {
    const spacing = " ".repeat(indent);
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      
      const items = value.map(item => spacing + prettyPrint(item, indent + 2));
      return "[\\n" + items.join(",\\n") + " ]";
    } 
    // Handle functions
    else if (typeof value === "function") {
      return "function";
    } 
    // Handle objects
    else if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value).map(([key, val]) => {
        // Format key: use quotes only if key contains special characters
        const formattedKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : \`"\${key}"\`;
        const formattedValue = prettyPrint(val, indent + 2);
        return \`\${spacing}\${formattedKey}: \${formattedValue}\`;
      });
      return "{\\n" + entries.join(",\\n") + " }";
    } 
    // Handle primitives (string, number, boolean, null, undefined)
    else {
      return JSON.stringify(value);
    }
  }

  /**
   * Handles serialization of console arguments with error handling
   * @param {any} arg - Argument to serialize
   * @returns {string} Serialized representation of the argument
   */
  function serializeArg(arg) {
    try {
      return prettyPrint(arg);
    } catch (e) {
      return "[Unserializable]";
    }
  }

  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:27020");

    ws.onopen = function() {
      // Connection established, send any queued messages
      flushQueue();
    };
  }

  // Store original console methods


  /**
   * Creates a console method interceptor for a specific log type
   * @param {Function} originalMethod - The original console method
   * @returns {Function} The intercepted method
   */
  function createConsoleInterceptor(originalMethod, type) {
    return function() {
      originalMethod.apply(console, arguments);

      // Convert arguments to array for processing
      const args = Array.prototype.slice.call(arguments);
      
      // Extract source location from stack trace
      const location = getStackInfo();

      // Create log data object with type field
      const logData = {
        where: "client-message",
        type: type,
        message: args.map(serializeArg).join(" "),
        location: location,
        timestamp: new Date().toISOString()
      };

      // Send immediately if WebSocket is connected, otherwise queue for later
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(logData));
      } else {
        messageQueue.push(logData);
      }
    };
  }

  console.log = createConsoleInterceptor(originalConsoleLog, 'log');
  console.warn = createConsoleInterceptor(originalConsoleWarn, 'warn');
  console.error = createConsoleInterceptor(originalConsoleError, 'error');
  console.info = createConsoleInterceptor(originalConsoleInfo, 'info');
  console.table = createConsoleInterceptor(originalConsoleTable, 'table');
  // console.timeEnd = createConsoleInterceptor(originalConsoleTimeEnd, 'timeEnd');

  // Start WebSocket connection
  connectWebSocket();

  // Debug confirmation that injection was successful
  originalConsoleLog("Console Warrior initialized");
})();
</script>`;
