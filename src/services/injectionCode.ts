// Código que se inyecta en las páginas HTML para conectar el WebSocket y redirigir los logs
export const injectionCode = `
<script>
(function() {
    var originalConsoleLog = console.log;
    var messageQueue = [];
    var ws = null;
    var autoReloadEnabled = false;
    const ansiRegex = /\x1b\[[0-9;]*m/g;

    
    function getStackInfo() {
      try {
        const stackLines = Error().stack.split("\\n");
        let relevantLine = "";
                
        for(let line of stackLines) {
          if(line.includes(".tsx")) {
            relevantLine = line;
            break;
          }
        }
                
        let match = relevantLine.match(/\\((.+?\\.tsx(\\?[^:)]+)?):(\\d+):(\\d+)\\)/);
        if (match) {
          return {  
            url: match[1],
            line: parseInt(match[3]),
            column: parseInt(match[4])
          };
        }
                
        match = relevantLine.match(/at\\s+(.+?\\.tsx(\\?[^:)]+)?):(\\d+):(\\d+)/);
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
      switch(command.type) {
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
    
    function connectWebSocket() {
      ws = new WebSocket("ws://localhost:9000");
      
      ws.onopen = function() {
        // Usamos el console.log original para este mensaje
        originalConsoleLog("WebSocket connection established");
        
        // Configuramos un proxy para console.log que mantiene el comportamiento normal
        // pero también envía datos por WebSocket
        console.log = function() {
          // Mostrar el mensaje normalmente en la consola
          originalConsoleLog.apply(console, arguments);
          
          // Preparar y enviar datos por WebSocket
          var args = Array.prototype.slice.call(arguments);
          var location = getStackInfo();
          var logData = {
            type: "log",
            message: args.filter(str => !ansiRegex.test(str)).join(" "),
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
        // Restaurar console.log en caso de error
        // console.log = originalConsoleLog;
      };
      
      ws.onclose = function() {
        originalConsoleLog("WebSocket closed, reconnecting in 3s...");
        // Restaurar console.log cuando se cierra la conexión
        // console.log = originalConsoleLog;
        setTimeout(connectWebSocket, 3000);
      };
    }
    
    // Inicialmente, guardamos mensajes en cola pero también los mostramos normalmente
    console.log = function() {
      // Mostrar mensaje normalmente en consola
      originalConsoleLog.apply(console, arguments);
      
      // Guardar para enviar por WebSocket cuando se conecte
      var args = Array.prototype.slice.call(arguments);
      var location = getStackInfo();
      var logData = {
        message: args.filter(str => !ansiRegex.test(str)).join(" "),
        location: location
      };
      messageQueue.push(logData);
    };
    
    connectWebSocket();
})();
</script>`;
