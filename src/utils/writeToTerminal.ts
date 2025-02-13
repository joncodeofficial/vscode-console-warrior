export const writeToTerminal = (
  colorCode = 32,
  message = "Console Warrior is loading...",
  vscode: typeof import("vscode")
) => {
  let terminal = vscode.window.terminals.find(
    (t) => t.name === "Console Warrior"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Console Warrior");
  }
  terminal.show();

  terminal.sendText(
    `echo -e "\\e[${colorCode}m${message}\\e[0m" && echo -e "\\e[1A\\e[1A\\e[2K\\e[1S"`
  );
};
