export const injectionCode = ` (function() {
  var originalConsoleLog = console.log;
  var messageQueue = [];
  var ws = null;

  function getStackInfo() {
    try {
      const stackLines = Error().stack.split('\\n');
      let relevantLine = '';

      // Buscar la línea que contiene la llamada real a console.log
      for(let line of stackLines) {
        if(line.includes('.js:')) {
          relevantLine = line;
          break;
        }
      }

      // Extraer información del archivo, línea y columna
      const match = relevantLine.match(/\\((.+?\\.js):(\\d+):(\\d+)\\)/);
      if (match) {
        return {
          file: match[1].split('/').pop(), // Extraer solo el nombre del archivo
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10)
        };
      }

      // Si no encuentra el patrón exacto, buscar un patrón alternativo
      const altMatch = relevantLine.match(/at\\s+(.+?\\.js):(\\d+):(\\d+)/);
      if (altMatch) {
        return {
          file: altMatch[1].split('/').pop(), // Extraer solo el nombre del archivo
          line: parseInt(altMatch[2], 10),
          column: parseInt(altMatch[3], 10)
        };
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  function processArguments(args) {
    return args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return '[Circular Object]';
        }
      }
      return arg;
    });
  }

  function flushQueue() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      while (messageQueue.length > 0) {
        ws.send(JSON.stringify(messageQueue.shift()));
      }
    }
  }

  function connectWebSocket() {
    ws = new WebSocket('ws://localhost:9000');

    ws.onopen = function() {
      originalConsoleLog('WebSocket connection established');
      console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        var processedArgs = processArguments(args);
        var location = getStackInfo();
        var logData = {
          message: processedArgs.join(' '),
          location: location
        };
        originalConsoleLog(JSON.stringify(logData));
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(logData));
        } else {
          messageQueue.push(logData);
        }
      };
      flushQueue();
    };

    ws.onerror = function(error) {
      originalConsoleLog('WebSocket error:', error);
    };

    ws.onclose = function() {
      originalConsoleLog('WebSocket closed, reconnecting in 3s...');
      setTimeout(connectWebSocket, 3000);
    };
  }

  console.log = function() {
    var args = Array.prototype.slice.call(arguments);
    var processedArgs = processArguments(args);
    var location = getStackInfo();
    var logData = {
      message: processedArgs.join(' '),
      location: location
    };
    originalConsoleLog(JSON.stringify(logData));
    messageQueue.push(logData);
  };

  connectWebSocket();
})(); `;
