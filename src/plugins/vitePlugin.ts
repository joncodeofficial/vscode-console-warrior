import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

type InjectionMarkers = {
  isExtensionCreated: boolean;
  isExtensionCurrentVersion: boolean;
  isWebSocketInjected: boolean;
};

const getExtensionPath = (vscode: typeof import('vscode')): string | undefined => {
  const extensionPath = vscode.extensions.getExtension('jonpena.console-warrior')?.extensionPath;
  if (!extensionPath) return undefined;

  let formatPath = path.resolve(extensionPath, 'dist/injectionCode.js');

  // Convert the path to a file URL on Windows
  if (process.platform === 'win32') formatPath = pathToFileURL(formatPath).toString();

  return formatPath;
};

const checkInjectionStatus = (fileContent: string, formatPath: string): InjectionMarkers => {
  return {
    isExtensionCreated: fileContent.includes('console-warrior-plugin'),
    isExtensionCurrentVersion: fileContent.includes(formatPath),
    isWebSocketInjected: fileContent.includes('console-warrior-websocket'),
  };
};

const generatePluginCode = (formatPath: string): string => {
  return `const server = await createServer({
      /* guide start */
      plugins: [{
          name: "console-warrior-plugin",
          async transform(code, id) {
            if (id.includes('node_modules')) return null;
            if (!/\\.(js|mjs|ts|mts|jsx|tsx|vue|svelte)$/.test(id)) return null;

            try {
              // Resolve injection file inside your plugin 
              const injectionUrl = await import.meta.resolve("${formatPath}");
              const module = await import(injectionUrl);

              return {
                code: code + '\\n' + (module.injectionCode ?? ''),
                map: null
              };
            } catch (error) {
              console.error('Failed to import vite plugin:', error);
              return null;
            }
          }
       }], /* guide end */`;
};

const generateWebSocketCode = (): string => {
  return `await server.listen();
  /* console-warrior-websocket start */
  const socket = new WebSocket(\`ws://localhost:47020\`);
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      where: 'server-info',
      id: server.httpServer.address().port,
      workspace: process.cwd()
    }));
    setTimeout(() => socket.close(), 100);
  });
  const green = (txt) => \`\x1b[32m\${txt}\x1b[0m\`;
	const magentaBold = (txt) => \`\x1b[35;1m\${txt}\x1b[0m\`;
  console.log(\`\${green("Console Warrior ⚔️  connected to ")}\${magentaBold("VITE")}\`);
	console.log((\`\${green("------------------------------------")}\`));
  /* console-warrior-websocket end */`;
};

const removeOldPluginCode = (fileContent: string): string => {
  return fileContent.replace(/\r?\n?\/\* guide start \*\/[\s\S]*?\/\* guide end \*\/\r?\n?/g, '');
};

const removeOldWebSocketCode = (fileContent: string): string => {
  return fileContent.replace(
    /\r?\n?\s*\/\* console-warrior-websocket start \*\/[\s\S]*?\/\* console-warrior-websocket end \*\/\r?\n?/g,
    ''
  );
};

const injectPluginCode = (fileContent: string, pluginCode: string): string => {
  const insertionPoint = 'const server = await createServer({';

  if (fileContent.includes(insertionPoint)) {
    return fileContent.replace(insertionPoint, pluginCode);
  } else {
    console.log('No find the insertion point.');
    return fileContent;
  }
};

const injectWebSocketCode = (fileContent: string, webSocketCode: string): string => {
  const listenInsertionPoint = 'await server.listen();';

  if (fileContent.includes(listenInsertionPoint)) {
    return fileContent.replace(listenInsertionPoint, webSocketCode);
  }
  return fileContent;
};

export const vitePlugin = (vscode: typeof import('vscode'), relativePath: string) => {
  return (() => {
    try {
      // Get the current workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return;

      // Specific path to the file cli.js in vite
      const targetFile = path.join(relativePath, '/vite/dist/node/cli.js');

      // Verify if the file exists
      if (!fs.existsSync(targetFile)) return;

      // Read the file content
      let fileContent = fs.readFileSync(targetFile, 'utf8');

      const formatPath = getExtensionPath(vscode);
      if (!formatPath) return;

      // Check current injection status
      const markers = checkInjectionStatus(fileContent, formatPath);

      // Generate code templates
      const pluginCode = generatePluginCode(formatPath);
      const webSocketCode = generateWebSocketCode();

      // Update the plugin if it already exists but is outdated
      if (markers.isExtensionCreated && !markers.isExtensionCurrentVersion) {
        fileContent = removeOldPluginCode(fileContent);
      }

      // Update the WebSocket code if it already exists
      if (markers.isWebSocketInjected) {
        fileContent = removeOldWebSocketCode(fileContent);
      }

      // Inject plugin code if needed
      if (!markers.isExtensionCreated || !markers.isExtensionCurrentVersion) {
        fileContent = injectPluginCode(fileContent, pluginCode);
      }

      // Inject WebSocket code
      fileContent = injectWebSocketCode(fileContent, webSocketCode);

      // Write the modified file content back to the file if any changes were made
      if (
        !markers.isExtensionCreated ||
        !markers.isExtensionCurrentVersion ||
        markers.isWebSocketInjected
      ) {
        fs.writeFileSync(targetFile, fileContent, 'utf8');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error to insert plugin: ${error}`);
    }
  })();
};
