import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export const vitePlugin = (vscode: typeof import('vscode'), relativePath: string) => {
  return (() => {
    try {
      // Get the current workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        // vscode.window.showErrorMessage('No hay un workspace abierto.');
        return;
      }

      // Specific path to the file cli.js in vite
      const targetFile = path.join(relativePath, '/vite/dist/node/cli.js');

      // Verify if the file exists
      if (!fs.existsSync(targetFile)) {
        // vscode.window.showErrorMessage(
        //   `El archivo ${targetFile} no existe. Asegúrate de que Vite esté instalado en tu proyecto.`
        // );
        return;
      }

      // Read the file content
      let fileContent = fs.readFileSync(targetFile, 'utf8');

      const extensionPath = vscode.extensions.getExtension(
        'jonpena.console-warrior-logs'
      )?.extensionPath;

      if (!extensionPath) return;

      let formatPath = path.resolve(extensionPath, 'dist/injectionCode.js');

      // Convert the path to a file URL on Windows
      if (process.platform === 'win32') {
        formatPath = pathToFileURL(formatPath).toString();
      }

      const isExtensionCreated = fileContent.includes('console-warrior-logs-plugin');
      const isExtensionCurrentVersion = fileContent.includes(extensionPath);
      // if not found, Add plugin in the file in the correct position
      const insertionPoint = 'const server = await createServer({';

      // Insert the plugin code
      const pluginCode = `const server = await createServer({
      /* guide start */
      plugins: [{
          name: "console-warrior-logs-plugin",
          transformIndexHtml(html) {
              return new Promise((resolve) => {
                  const vscodePath = ${extensionPath};
                  import(vscodePath)
                      .then(function (n) { return n.injectionCode; })
                      .then(injection => resolve(html.replace("</head>", injection + "</head>")));
              });
          },
      }], /* guide end */`;

      // Update the plugin if it already exists
      if (isExtensionCreated && !isExtensionCurrentVersion) {
        // Usamos una RegExp para encontrar y eliminar el contenido entre los delimitadores
        fileContent = fileContent.replace(
          /\r?\n?\/\* guide start \*\/[\s\S]*?\/\* guide end \*\/\r?\n?/g,
          ''
        );
        fs.writeFileSync(targetFile, fileContent, 'utf-8');
        // vscode.window.showInformationMessage(
        //   'El plugin console-warrior-plugin se actualizó correctamente en el archivo cli.js de Vite.'
        // );
      }

      if (isExtensionCreated) {
        // vscode.window.showInformationMessage(
        //   'El plugin console-warrior-plugin ya está presente en el archivo.'
        // );
        return;
      }

      // Replace the insertion point with our plugin code
      if (fileContent.includes(insertionPoint)) {
        fileContent = fileContent.replace(insertionPoint, pluginCode);

        // Write the modified file content back to the file
        fs.writeFileSync(targetFile, fileContent, 'utf8');
        // vscode.window.showInformationMessage(
        //   'Plugin Console warrior insertado correctamente en el archivo cli.js de Vite.'
        // );
      } else {
        console.log('No find the insertion point.');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error to insert plugin: ${error}`);
    }
  })();
};
