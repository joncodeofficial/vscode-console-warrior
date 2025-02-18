// Código que se inyecta en las páginas HTML para conectar el WebSocket y redirigir los logs
export const injectionCode = `
(function() {
  var originalConsoleLog = console.log;
  var messageQueue = [];
  var ws = null;

  function getStackInfo() {
    try {
      const stackLines = Error().stack.split('\\n');
      let relevantLine = '';
      
      // Buscar la línea que contiene la llamada real a console.log
      for(let line of stackLines) {
        if(line.includes('.js')) {
          relevantLine = line;
          break;
        }
      }
      
      // Extraer información del archivo, línea y columna
      let match = relevantLine.match(/\\((.+?\\.js(\\?[^:)]+)?):(\\d+):(\\d+)\\)/);
      if (match) {
        const fullPath = match[1];
        const fileName = fullPath.split('/').pop().split('?')[0];
        
        return {
          file: fileName,
          line: parseInt(match[3]),
          column: parseInt(match[4]) // Añadimos la columna
        };
      }
      
      // Patrón alternativo modificado
      match = relevantLine.match(/at\\s+(.+?\\.js(\\?[^:)]+)?):(\\d+):(\\d+)/);
      if (match) {
        const fullPath = match[1];
        const fileName = fullPath.split('/').pop().split('?')[0];
        
        return {
          file: fileName,
          line: parseInt(match[3]),
          column: parseInt(match[4]) // Añadimos la columna
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

  function connectWebSocket() {
    ws = new WebSocket('ws://localhost:9000');

    ws.onopen = function() {
      originalConsoleLog('WebSocket connection established');
      console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        var location = getStackInfo();
        var logData = {
          message: args.join(' '),
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
    var location = getStackInfo();
    var logData = {
      message: args.join(' '),
      location: location
    };
    originalConsoleLog(JSON.stringify(logData));
    messageQueue.push(logData);
  };

  connectWebSocket();
})();
`;
