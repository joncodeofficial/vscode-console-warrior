import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

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

      const extensionPath =
        vscode.extensions.getExtension('jonpena.console-warrior')?.extensionPath;

      if (!extensionPath) return;

      let formatPath = path.resolve(extensionPath, 'dist/injectionCode.js');

      // Convert the path to a file URL on Windows
      if (process.platform === 'win32') {
        formatPath = pathToFileURL(formatPath).toString();
      }

      const isExtensionCreated = fileContent.includes('console-warrior-plugin');
      const isExtensionCurrentVersion = fileContent.includes(formatPath);
      // if not found, Add plugin in the file in the correct position
      const insertionPoint = 'const server = await createServer({';

      const pluginCode = `const server = await createServer({
      /* guide start */
      plugins: [{
          name: "console-warrior-plugin",
          async transform(code, id) {
            if (id.includes('node_modules')) return null;
            if (!/\.(js|mjs|ts|mts|jsx|tsx|vue|svelte)$/.test(id)) return null;
            try {
              const module = await import("${formatPath}");
                return {
                  code: code + '\\n' + module.injectionCode,
                  map: null
                };
            } catch (error) {
              console.error('Failed to import vite plugin:', error);
              return null;
            }
          }
       }], /* guide end */`;

      // Update the plugin if it already exists
      if (isExtensionCreated && !isExtensionCurrentVersion) {
        // We use a regular expression to match the insertion point and  remove the plugin code
        fileContent = fileContent.replace(
          /\r?\n?\/\* guide start \*\/[\s\S]*?\/\* guide end \*\/\r?\n?/g,
          ''
        );
      }

      // Add the plugin code if it doesn't exist or if it's outdated
      if (!isExtensionCreated || !isExtensionCurrentVersion) {
        // Replace the insertion point with our plugin code
        if (fileContent.includes(insertionPoint)) {
          fileContent = fileContent.replace(insertionPoint, pluginCode);
          // Write the modified file content back to the file
          fs.writeFileSync(targetFile, fileContent, 'utf8');
        } else {
          console.log('No find the insertion point.');
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error to insert plugin: ${error}`);
    }
  })();
};
