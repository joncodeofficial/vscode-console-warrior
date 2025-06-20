# Console Warrior

## 🚀 Visualize `console.log` messages directly inside your VSCode editor.

![Presentation](https://raw.githubusercontent.com/jonpena/vscode-console-warrior-logs/main/images/presentation.gif)

---

## ✨ Features

- 🚀 Inline display of `console.log` output from the browser.
- 🌐 Real-time WebSocket-based communication.
- ⚡ One-click command to connect to your log stream.
- 🧩 Currently supports **Vite-based** projects.
- 💡 Open source & built for the community.

## ⚙️ How to Use

1. Start your Vite dev server (only Vite is supported for now, with some limitations).
2. By default, the extension connects to port `5173`.
3. To use a different port (e.g. if you have multiple Vite apps), open the command palette and run:
   Then enter the new port your app is using.
4. Open any file with `console.log` statements.
5. 🎉 Logs will appear directly under the lines where they’re called.

> ⚠️ Currently supports **only Vite** apps running in the browser, and support is limited. Compatibility with other tools and environments is planned for future versions.

---

## 🧠 Why Console Warrior?

Modern debugging deserves modern tools — but until now, there wasn’t a truly **open source**, **community-driven**, and **non-profit** extension that brings real-time `console.log` output directly into VSCode.

**Console Warrior** was created to change that.

Built from the ground up and released under the **Apache 2.0 license**, this project is designed to help developers:

- ⚡ Improve feedback loops during development
- 🧼 Keep their workflow clean and efficient
- 🤝 Collaborate on a tool made by and for the dev community

Whether you're contributing code or simply using it day-to-day, you're part of the mission to make debugging in VSCode a smoother experience — without relying on closed or commercial solutions.

## 🤝 Contributing

We **welcome contributions** of all kinds! Whether you're improving documentation, optimizing performance, adding support for new environments or frameworks, or working on testing — you're invited to collaborate.

Please make sure to follow the contribution guidelines outlined in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

We're especially looking forward to contributions in:

- 🔧 Framework support (e.g., Next.js, Astro, etc.)
- 📚 Plugin system for extensibility
- ⚙️ Configuration options (log filtering, formatting, etc.)
- 🧪 Tests and developer experience improvements

If you're ready to help, check out the [Issues](https://github.com/jonpena/vscode-console-warrior-logs/issues) to get started.

---

## 📌 Roadmap & Feedback

- [🪲 Report Issues](https://github.com/jonpena/vscode-console-warrior-logs/issues)
- [📖 Changelog](https://github.com/jonpena/vscode-console-warrior-logs/releases)

---

## ⚖️ Legal Notice

This project was **developed entirely from scratch**, without access to or use of any proprietary source code.  
While it may be **inspired by the publicly observable behavior** of similar tools, all code, logic, architecture, and design decisions are **100% original** and implemented independently by the author.

Console Warrior is a **non-profit, open source** initiative created to serve the web development community.  
All usage and contributions are governed by the project's open source license.

> ⚠️ This extension is **not affiliated with, endorsed by, or related to Console Ninja or any similar commercial tool**.

If you're a rights holder and have questions or concerns, please open an issue or contact the project maintainer directly.
