import fs from "fs";
import path from "path";
type VSCODE = typeof import("vscode");

export const vitePlugin = (vscode: VSCODE, relativePath: string) => {
  return (() => {
    try {
      // Get the current workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No hay un workspace abierto.");
        return;
      }

      // Specific path to the file cli.js in vite
      const targetFile = path.join(relativePath, "/vite/dist/node/cli.js");

      // Verificar que el archivo existe
      if (!fs.existsSync(targetFile)) {
        vscode.window.showErrorMessage(
          `El archivo ${targetFile} no existe. Asegúrate de que Vite esté instalado en tu proyecto.`
        );
        return;
      }

      // Read the file content
      let fileContent = fs.readFileSync(targetFile, "utf8");

      // The specific insertion point
      const insertionPoint = "const server = await createServer({";

      // The code you want to insert
      const pluginCode = `const server = await createServer({
      plugins: [{
          name: "console-warrior-plugin",
          transformIndexHtml(html) {
              return new Promise((resolve) => {
                  const vscodePath = path.resolve(process.env.HOME || '', '.vscode/extensions/probando.js');
                  import(vscodePath)
                      .then(function (n) { return n.injectionCode; })
                      .then(result => resolve(html.replace("</head>", result + "</head>")));
              });
          },
      }],`;

      // Check if the plugin already exists
      if (fileContent.includes("console-warrior-plugin")) {
        vscode.window.showInformationMessage(
          "El plugin console-warrior-plugin ya está presente en el archivo."
        );
        return;
      }

      // Replace the insertion point with our plugin code
      if (fileContent.includes(insertionPoint)) {
        fileContent = fileContent.replace(insertionPoint, pluginCode);

        // const test = "server.printUrls();";

        // const testCode = `
        //   console.log(colors.green("  ➜  Console Warrior ⚔️  supports"), colors.magenta(colors.bold("VITE")));
        //   console.log(colors.green("  ➜  ================================"));
        //   server.printUrls();
        //   `;

        // fileContent = fileContent.replace(test, testCode);

        // Write the modified file content back to the file
        fs.writeFileSync(targetFile, fileContent, "utf8");
        vscode.window.showInformationMessage(
          "Plugin Console warrior insertado correctamente en el archivo cli.js de Vite."
        );
      } else {
        console.log("No find the insertion point.");
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error to insert plugin: ${error}`);
    }
  })();
};
