export const injectionCode = `
if (typeof window !== "undefined" && !window.__consoleWsPatched) {
  (function() {
    var originalConsoleLog = console.log;
    var originalConsoleWarn = console.warn;
    var originalConsoleInfo = console.info;
    var originalConsoleError = console.error;
    var originalConsoleTable = console.table;
    var originalConsoleDebug = console.debug;
    
    var messageQueue = [];
    var ws = null;
    var extensions = [".js", ".mjs", ".ts", ".mts", ".jsx", ".tsx", ".vue", ".svelte"];

    function getStackInfo() {
      try {
        var stack = Error().stack;
        var stackLines = stack.split("\\n");

        // Detect Firefox stack trace format vs Chrome/Safari
        // Firefox format: "function@file:line:column" or "@file:line:column"
        // Chrome/Safari format: "at function (file:line:column)"
        var isFirefox = false;
        for (var k = 0; k < stackLines.length; k++) {
          if (stackLines[k].includes('@') && !stackLines[k].includes('at ')) {
            isFirefox = true;
            break;
          }
        }

        if (isFirefox) {
          // Process Firefox stack trace format
          for (var i = 1; i < stackLines.length; i++) {
            var line = stackLines[i].trim();
            
            if (line.includes("createConsoleInterceptor") || 
                line.includes("getStackInfo") ||
                line.includes("console.")) continue;

            // Skip lines that don't contain our target file extensions
            var hasExtension = false;
            for (var j = 0; j < extensions.length; j++) {
              if (line.includes(extensions[j])) {
                hasExtension = true;
                break;
              }
            }
            if (!hasExtension) continue;

            // Match pattern: anything@file.extension:line:column
            var match = line.match(/^.*@(.*\\.(js|mjs|ts|mts|jsx|tsx|vue|svelte)(?:\\?[^:]*)??):(\\d+):(\\d+)$/);
            if (match) {
              var url = match[1];
              var filename = url.split("/").pop() || url;
              return {
                url,
                line: parseInt(match[3]),
                column: parseInt(match[4])
              };
            }
          }
        } else {
          // Process Chrome/Safari stack trace format
          for (var i = 1; i < stackLines.length; i++) {
            var line = stackLines[i];
            
            if (line.includes("createConsoleInterceptor") || 
                line.includes("getStackInfo") ||
                line.includes("console.") ||
                line.includes("Object.") ||
                line.includes("Function.")) continue;

            // Skip lines that don't contain our target file extensions
            var hasExtension = false;
            for (var j = 0; j < extensions.length; j++) {
              if (line.includes(extensions[j])) {
                hasExtension = true;
                break;
              }
            }
            if (!hasExtension) continue;

            // Try pattern with parentheses: "at function (file:line:column)"
            var match = line.match(/\\s+at\\s+[^(]*\\(([^)]+\\.(js|mjs|ts|mts|jsx|tsx|vue|svelte)(?:\\?[^:)]+)?):(\\d+):(\\d+)\\)/);
            if (match) {
              var url = match[1];
              var filename = url.split("/").pop() || url;
              return {
                url,
                line: parseInt(match[3]),
                column: parseInt(match[4])
              };
            }
            // Try pattern without parentheses: "at file:line:column"
            match = line.match(/\\s+at\\s+([^\\s]+\\.(js|mjs|ts|mts|jsx|tsx|vue|svelte)(?:\\?[^:]+)?):(\\d+):(\\d+)/);
            if (match) {
              var url = match[1];
              var filename = url.split("/").pop() || url;
              return {
                url,
                line: parseInt(match[3]),
                column: parseInt(match[4])
              };
            }
          }
        }

        return null;
      } catch (e) {
        return null;
      }
    }

    function flushQueue() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        while (messageQueue.length > 0) {
          ws.send(JSON.stringify(messageQueue.shift()));
        }
      }
    }

    function prettyPrint(value, indent = 0) {
      const spacing = " ".repeat(indent);
      const nextSpacing = " ".repeat(indent + 2);
 
      if(value === undefined) return "undefined";

      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        const items = value.map((item, i) => (i === 0 ? nextSpacing : '') + prettyPrint(item, indent + 2));
        return "[\\n" + items.join(", ") + "\\n" + spacing + "]";
      } 
      else if (typeof value === "function") {
        return "function()";
      } 
      else if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value);
        if (entries.length === 0) return "{}";
    
        const formattedEntries = entries.map(([key, val]) => {
        // Format key: use quotes only if key contains special characters
        const formattedKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : \`"\${key}"\`;
        const formattedValue = prettyPrint(val, indent + 2);
        return \`\${nextSpacing}\${formattedKey}: \${formattedValue}\`;
      });
        return "{\\n" + formattedEntries.join(",\\n") + "\\n" + spacing + "}";
      } 
      else {
        return JSON.stringify(value);
      }
    }

    function serializeArg(arg) {
      try {
        return prettyPrint(arg);
      } catch (e) {
        return "[unserializable]";
      }
    }

    function connectWebSocket() {
      try {
        ws = new WebSocket("ws://localhost:47020");

        ws.onopen = function() {
          flushQueue();
        };
        
        ws.onclose = function() {
          setTimeout(connectWebSocket, 3000);
        };
        
        ws.onerror = function() {
          // Silent
        };
      } catch (e) {
        // Silent
      }
    }

    function createConsoleInterceptor(originalMethod, type) {
      return function() {
        originalMethod.apply(console, arguments);

        var args = Array.prototype.slice.call(arguments);
        var location = getStackInfo();

        if (!location) return;

        var message = "";
        for (var i = 0; i < args.length; i++) {
          if (i > 0) message += " ";
          message += serializeArg(args[i]);
        }

        var consoleData = {
          where: "client-message",
          type,
          message,
          location,
          timestamp: new Date().toISOString(),
        };

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(consoleData));
        } else {
          messageQueue.push(consoleData);
        }
      };
    }

    console.log = createConsoleInterceptor(originalConsoleLog, "log");
    console.warn = createConsoleInterceptor(originalConsoleWarn, "warn");
    console.error = createConsoleInterceptor(originalConsoleError, "error");
    console.info = createConsoleInterceptor(originalConsoleInfo, "info");
    console.table = createConsoleInterceptor(originalConsoleTable, "table");
    console.debug = createConsoleInterceptor(originalConsoleDebug, "debug");

    connectWebSocket();
    window.__consoleWsPatched = true;
  })();
}
`;
