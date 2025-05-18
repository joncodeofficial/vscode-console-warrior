import fs from "fs";
import path from "path";

type VSCODE = typeof import("vscode");

export const consoleInjectPlugin = (vscode: VSCODE, relativePath: string) => {
  return (() => {
    try {
      // Obtener el workspace actual
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No hay un workspace abierto.");
        return;
      }

      // Ruta específica al archivo cli.js en vite
      const targetFile = path.join(relativePath, "/vite/dist/node/cli.js");

      // Verificar que el archivo existe
      if (!fs.existsSync(targetFile)) {
        vscode.window.showErrorMessage(
          `El archivo ${targetFile} no existe. Asegúrate de que Vite esté instalado en tu proyecto.`
        );
        return;
      }

      // Leer el archivo
      let fileContent = fs.readFileSync(targetFile, "utf8");

      // El punto de inserción específico
      const insertionPoint = "const server = await createServer({";

      // El código que deseas insertar
      const pluginCode = `const server = await createServer({
      plugins: [{
          name: "console-inject-plugin",
          transformIndexHtml(html) {
              return new Promise((resolve) => {
                  const vscodePath = path.resolve(process.env.HOME || '', '.vscode/extensions/probando.js');
                  import(vscodePath)
                      .then(function (n) { return n.injectionCode; })
                      .then(result => resolve(html.replace("</head>", result + "</head>")));
              });
          },
      }],`;

      // Comprobar si ya existe el plugin
      if (fileContent.includes("console-inject-plugin")) {
        vscode.window.showInformationMessage(
          "El plugin console-inject-plugin ya está presente en el archivo."
        );
        return;
      }

      // Reemplazar el punto de inserción con nuestro código
      if (fileContent.includes(insertionPoint)) {
        fileContent = fileContent.replace(insertionPoint, pluginCode);

        const test = "server.printUrls();";

        const testCode = `
          console.log(colors.green("  ➜  Console inject ⚔️  supports"), colors.magenta(colors.bold("VITE")));
          console.log(colors.green("  ➜  ================================"));
          server.printUrls();
          `;

        fileContent = fileContent.replace(test, testCode);

        // Escribir el archivo modificado
        fs.writeFileSync(targetFile, fileContent, "utf8");
        vscode.window.showInformationMessage(
          "Plugin Console inject insertado correctamente en el archivo cli.js de Vite."
        );
      } else {
        vscode.window.showErrorMessage(
          `No se encontró el punto de inserción "${insertionPoint}" en el archivo. Es posible que la versión de Vite sea diferente.`
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error al modificar el archivo`);
    }
  })();
};
