# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Console Warrior, please report it by:

1. **GitHub**: Use the [private vulnerability reporting](https://github.com/joncodeofficial/vscode-console-warrior/security/advisories/new) feature

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Measures

This extension:

- Does not collect or transmit user data
- Uses WebSocket connections locally for real-time log streaming
- Processes all data locally on your machine
- Is open source and can be audited at https://github.com/joncodeofficial/vscode-console-warrior
- All code is non-obfuscated and readable

## Architecture & Data Flow

This section documents the runtime behavior of Console Warrior for anyone
auditing the compiled `dist/` bundle or a third-party static-analysis report.

- **Console hook**: the injected client code (`injectionCode.js`) monkey-patches
  the `console` object (`log`, `warn`, `error`, etc.) inside the instrumented
  dev-server/browser process, so calls can be captured and forwarded without
  changing how the user writes `console.*` statements.
- **Transport**: a WebSocket server (`webSocketServer.ts`) relays captured
  console data between the instrumented process and the VS Code extension in
  real time. WebSocket is used instead of HTTP polling purely for latency —
  the same reasoning as tools like Console Ninja or Wallaby.js. The server is
  bound to `127.0.0.1` only; it is not reachable from other devices on the
  network.
- **Vite detection**: `watcherNodeModules.ts` watches for `node_modules`
  directories in the open workspace to detect Vite installs and activate the
  Vite plugin (`plugins/vitePlugin.js`). This only reads directory entries
  (`fs.readdirSync`) to decide whether to attach the plugin — it does not
  execute, modify, or delete anything in `node_modules`.
- **Source maps**: `sourceMapping.js` resolves source maps for captured
  errors/logs so they point at the original TypeScript/JSX line instead of
  the transpiled output. This is a local file read via
  `@jridgewell/trace-mapping`, not a network fetch of remote code.
- **No `exec`/system commands**: automated scanners sometimes flag
  `RegExp.prototype.exec()` calls (e.g. in `hasValidConsole.ts`,
  `getPortFromUrl.ts`) as "system command execution" due to keyword matching
  on `exec(`. The codebase does not use `child_process`, `exec`, `execSync`,
  or `spawn` anywhere.
- **No external network calls**: all WebSocket/socket.io/fetch usage found by
  static scanners is local relay traffic between the extension and the
  instrumented dev process on `127.0.0.1`. Nothing is sent to a third-party
  server.

## License

This extension is licensed under Apache License 2.0. See [LICENSE](LICENSE) file for details.
