export const injectionCode = `
<script>
(function() {
  var originalConsoleLog = console.log;
  var messageQueue = [];
  var ws = null;
  var autoReloadEnabled = false;
  const ansiRegex = /\\x1b\\[[0-9;]*m/g;
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'];

  function getStackInfo() {
    try {
      const stackLines = Error().stack.split("\\n");
      let relevantLine = "";
      for (let line of stackLines) {
        if (extensions.some(ext => line.includes(ext))) {
          relevantLine = line;
          break;
        }
      }
      let match = relevantLine.match(/\\((.+?\\.(?:js|ts|jsx|tsx|vue|svelte\\.tsx)(\\?[^:)]+)?):(\\d+):(\\d+)\\)/);

      if (match) {
        return {  
          url: match[1],
          line: parseInt(match[3]),
          column: parseInt(match[4])
        };
      }
      match = relevantLine.match(/at\\s+(.+?\\.(?:js|ts|jsx|tsx|vue|svelte\\.tsx)(\\?[^:)]+)?):(\\d+):(\\d+)/);

      if (match) {
        return {
          url: match[1],
          line: parseInt(match[3]),
          column: parseInt(match[4])
        };
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

  function handleCommand(command) {
    switch (command.type) {
      case "enableAutoReload":
        autoReloadEnabled = true;
        break;
      case "disableAutoReload":
        autoReloadEnabled = false;
        break;
      case "reload":
        if (autoReloadEnabled) {
          window.location.reload();
          autoReloadEnabled = false;
        }
        break;
      default:
        originalConsoleLog("Unknown command:", command);
    }
  }

  function prettyPrint(value, indent = 2) {
    const spacing = " ".repeat(indent);
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      const items = value.map(item => spacing + prettyPrint(item, indent + 2));
      return "[\\n" + items.join(",\\n") + "\\n" + " ".repeat(indent - 2) + "]";
    } else if (typeof value === "function") {
      return "function";
    } else if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value).map(([key, val]) => {
        const formattedKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : \`"\${key}"\`;
        const formattedValue = prettyPrint(val, indent + 2);
        return \`\${spacing}\${formattedKey}: \${formattedValue}\`;
      });
      return "{\\n" + entries.join(",\\n") + "\\n" + " ".repeat(indent - 2) + "}";
    } else {
      return JSON.stringify(value);
    }
  }

  function serializeArg(arg) {
    try {
      return prettyPrint(arg);
    } catch (e) {
      return "[Unserializable]";
    }
  }

  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:27029");

    ws.onopen = function() {
      originalConsoleLog("WebSocket connection established");

      console.log = function() {
        originalConsoleLog.apply(console, arguments);

        var args = Array.prototype.slice.call(arguments);
        var location = getStackInfo();
        var logData = {
          type: "log",
          message: args.map(serializeArg).join(" "),
          location: location
        };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(logData));
        } else {
          messageQueue.push(logData);
        }
      };

      flushQueue();
    };

    ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type && data.type !== "log") {
          handleCommand(data);
        }
      } catch (e) {
        originalConsoleLog("Error processing message:", e);
      }
    };

    ws.onerror = function(error) {
      // originalConsoleLog("WebSocket error:", error);
    };

    ws.onclose = function() {
      originalConsoleLog("WebSocket closed, reconnecting in 3s...");
      setTimeout(connectWebSocket, 3000);
    };
  }

  console.log = function() {
    originalConsoleLog.apply(console, arguments);

    var args = Array.prototype.slice.call(arguments);
    var location = getStackInfo();
    var logData = {
      type: "log",
      message: args.map(serializeArg).join(" "),
      location: location
    };
    messageQueue.push(logData);
  };

  connectWebSocket();
})();
</script>`;
