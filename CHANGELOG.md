# Changelog

All notable changes to this project will be documented in this file.

## <small>1.2.4 (2025-06-24)</small>

- fix: clean up release workflow by removing unnecessary blank lines and optimizing steps ([e5da40c](https://github.com/jonpena/vscode-console-warrior/commit/e5da40c))

## [1.2.3](https://github.com/jonpena/vscode-console-warrior/compare/v1.2.2...v1.2.3) (2025-06-24)

### Bug Fixes

- clean up release workflow by removing unnecessary lines and improving structure ([f01cc73](https://github.com/jonpena/vscode-console-warrior/commit/f01cc737f7a3061df53085de9491bdd6e2cbcaf6))

## <small>1.2.2 (2025-06-24)</small>

- fix: remove unnecessary blank line in activate function ([24083ec](https://github.com/jonpena/vscode-console-warrior/commit/24083ec))

## <small>1.2.1 (2025-06-24)</small>

- fix: enhance stack trace parsing and WebSocket logging functionality Thanks Roy Almada ([19011f5](https://github.com/jonpena/vscode-console-warrior/commit/19011f5))
- chore: correct expected output in truncateString test case ([e566110](https://github.com/jonpena/vscode-console-warrior/commit/e566110))
- chore: fix expected output in truncateString test case ([477778f](https://github.com/jonpena/vscode-console-warrior/commit/477778f))
- chore: improve WebSocket connection handling and error logging ([49507a9](https://github.com/jonpena/vscode-console-warrior/commit/49507a9))
- chore: move VSIX packaging step after semantic release check ([2a3ef24](https://github.com/jonpena/vscode-console-warrior/commit/2a3ef24))
- chore: move X virtual framebuffer setup before running tests ([286a09c](https://github.com/jonpena/vscode-console-warrior/commit/286a09c))
- chore: reorder steps in release workflow to install vsce and build extension before running tests ([95a0741](https://github.com/jonpena/vscode-console-warrior/commit/95a0741))
- chore: reorder steps in release workflow to run tests after installing vsce ([540cd4f](https://github.com/jonpena/vscode-console-warrior/commit/540cd4f))
- chore: simplify variable names in monitoringChanges and text document change handler ([8748cf8](https://github.com/jonpena/vscode-console-warrior/commit/8748cf8))
- chore: update feature request template for clarity and detail ([96ab09d](https://github.com/jonpena/vscode-console-warrior/commit/96ab09d))
- chore: update test file path from 'out/test/**/\*.test.js' to 'dist/test/**/\*.test.js' ([9f6cd77](https://github.com/jonpena/vscode-console-warrior/commit/9f6cd77))
- test: add test step to release workflow and improve publish message ([eb5a048](https://github.com/jonpena/vscode-console-warrior/commit/eb5a048))

## 1.2.0 (2025-06-20)

- feat: add bug report template for improved issue tracking ([481e823](https://github.com/jonpena/vscode-console-warrior/commit/481e823))
- feat: add feature request template for user suggestions ([9a73310](https://github.com/jonpena/vscode-console-warrior/commit/9a73310))
- feat: add pull request template for better contribution guidelines ([9389e9a](https://github.com/jonpena/vscode-console-warrior/commit/9389e9a))

## <small>1.1.8 (2025-06-20)</small>

- fix: correct package script command for VSIX packaging ([377bc98](https://github.com/jonpena/vscode-console-warrior/commit/377bc98))
- fix: update package command to use npm script for VSIX packaging ([ebd692a](https://github.com/jonpena/vscode-console-warrior/commit/ebd692a))

## <small>1.1.7 (2025-06-20)</small>

- refactor: rename project from Console Warrior Logs to Console Warrior ([2fa15de](https://github.com/jonpena/vscode-console-warrior/commit/2fa15de))
- fix: comment out performance logging for cached sourcemaps ([0e024d2](https://github.com/jonpena/vscode-console-warrior/commit/0e024d2))

## <small>1.1.6 (2025-06-19)</small>

- fix: update publish message in release workflow and add @semantic-release/npm plugin ([2aaf727](https://github.com/jonpena/vscode-console-warrior-logs/commit/2aaf727))
- fix: wrap @semantic-release/npm configuration in an array for proper parsing ([f386c13](https://github.com/jonpena/vscode-console-warrior-logs/commit/f386c13))
- chore: update version to 0.0.0 and add @semantic-release/npm dependency ([bb95af1](https://github.com/jonpena/vscode-console-warrior-logs/commit/bb95af1))

## <small>1.1.5 (2025-06-19)</small>

- fix: standardize cache syntax and add publish step for VS Code Marketplace ([e26ca5d](https://github.com/jonpena/vscode-console-warrior-logs/commit/e26ca5d))
- chore: update version to 1.1.5 and remove packageManager entry from package.json ([bf7ff0f](https://github.com/jonpena/vscode-console-warrior-logs/commit/bf7ff0f))

## <small>1.1.4 (2025-06-16)</small>

- fix: correct logic for checking current version of the extension in vitePlugin ([7416487](https://github.com/jonpena/vscode-console-warrior-logs/commit/7416487))

## <small>1.1.3 (2025-06-16)</small>

- fix: correct import statement for dynamic module loading in vitePlugin ([c126b52](https://github.com/jonpena/vscode-console-warrior-logs/commit/c126b52))
- fix: remove unnecessary information messages for node_modules events ([5cda69f](https://github.com/jonpena/vscode-console-warrior-logs/commit/5cda69f))
- refactor: streamline error handling and improve code readability in vitePlugin ([a38200b](https://github.com/jonpena/vscode-console-warrior-logs/commit/a38200b))

## <small>1.1.2 (2025-06-16)</small>

- fix: convert path to file URL on Windows for injection code ([b86d160](https://github.com/jonpena/vscode-console-warrior-logs/commit/b86d160))

## <small>1.1.1 (2025-06-16)</small>

- refactor: rename IConsoleData to ConsoleData for consistency ([f256f48](https://github.com/jonpena/vscode-console-warrior-logs/commit/f256f48))
- refactor: rename IConsoleDataMap to ConsoleDataMap for consistency ([d973468](https://github.com/jonpena/vscode-console-warrior-logs/commit/d973468))
- refactor: rename IServerConnections to ServerConnections for consistency ([06b7c0c](https://github.com/jonpena/vscode-console-warrior-logs/commit/06b7c0c))
- refactor: rename ISourceMapCache to SourceMapCache for consistency ([94438e5](https://github.com/jonpena/vscode-console-warrior-logs/commit/94438e5))
- refactor: replace IConsoleData and related interfaces with ConsoleData for consistency ([40037d2](https://github.com/jonpena/vscode-console-warrior-logs/commit/40037d2))
- refactor: restrict ConsoleData type to 'client-message' or 'server-connect' ([d74e95a](https://github.com/jonpena/vscode-console-warrior-logs/commit/d74e95a))
- fix: empty message not response to ws ([be30d7e](https://github.com/jonpena/vscode-console-warrior-logs/commit/be30d7e))
- chore: add packageManager field to package.json ([6173275](https://github.com/jonpena/vscode-console-warrior-logs/commit/6173275))
- chore: update version to 1.1.1 and fix image link in README ([c59f9aa](https://github.com/jonpena/vscode-console-warrior-logs/commit/c59f9aa))
- chore: update version to 1.1.2 in package.json ([a0cb235](https://github.com/jonpena/vscode-console-warrior-logs/commit/a0cb235))

## 1.1.0 (2025-06-16)

- chore: bump version to 1.0.9 and remove commitlint configuration ([c2db768](https://github.com/jonpena/vscode-console-warrior-logs/commit/c2db768))
- refactor: update README for clarity and improved structure ([22ea60a](https://github.com/jonpena/vscode-console-warrior-logs/commit/22ea60a))
- feat: add commitlint configuration to enforce conventional commit messages ([c680052](https://github.com/jonpena/vscode-console-warrior-logs/commit/c680052))
- feat: add presentation GIF to enhance visual documentation ([ce20a54](https://github.com/jonpena/vscode-console-warrior-logs/commit/ce20a54))
- fix: use DEFAULT_PORT constant for connectPort fallback in activate function ([4b0f630](https://github.com/jonpena/vscode-console-warrior-logs/commit/4b0f630))

## <small>1.0.8 (2025-06-16)</small>

- fix: update display name and version in package.json to 1.0.8 ([53e2d68](https://github.com/jonpena/vscode-console-warrior-logs/commit/53e2d68))

## <small>1.0.7 (2025-06-16)</small>

- fix: update version in package.json to 1.0.7 and adjust vitePlugin type definition ([07812b7](https://github.com/jonpena/vscode-console-warrior-logs/commit/07812b7))

## <small>1.0.6 (2025-06-16)</small>

- fix: update display name and version in package.json ([ac09a4a](https://github.com/jonpena/vscode-console-warrior-logs/commit/ac09a4a))

## <small>1.0.5 (2025-06-16)</small>

- fix: comment out error and information messages in vitePlugin ([1f4511e](https://github.com/jonpena/vscode-console-warrior-logs/commit/1f4511e))
- fix: update package name and version in package.json ([54d4790](https://github.com/jonpena/vscode-console-warrior-logs/commit/54d4790))

## <small>1.0.4 (2025-06-15)</small>

- fix: add changelog entry for version 1.0.3 with updated VS Code extension label ([47b99aa](https://github.com/jonpena/vscode-console-warrior-logs/commit/47b99aa))
- fix: update version number and asset label in configuration files ([4e5734c](https://github.com/jonpena/vscode-console-warrior-logs/commit/4e5734c))

## <small>1.0.3 (2025-06-15)</small>

- fix: update version and label for VS Code extension ([f4f87c9](https://github.com/jonpena/vscode-console-warrior-logs/commit/f4f87c9))

## <small>1.0.2 (2025-06-15)</small>

- fix: enhance release workflow and configuration for better semantic release integration ([4cd4813](https://github.com/jonpena/vscode-console-warrior-logs/commit/4cd4813))

## <small>1.0.1 (2025-06-15)</small>

- fix: update package name and version in package.json ([347af65](https://github.com/jonpena/vscode-console-warrior-logs/commit/347af65))

## 1.0.0 (2025-06-15)

- fix: :art: improve ESLint configuration formatting and structure ([6ea7b47](https://github.com/jonpena/vscode-console-warrior-logs/commit/6ea7b47))
- fix: :art: los datos se estan renderizand de forma correcta. ([d371113](https://github.com/jonpena/vscode-console-warrior-logs/commit/d371113))
- fix: :bug: update stack trace parsing to support .jsx file extensions ([dec73cc](https://github.com/jonpena/vscode-console-warrior-logs/commit/dec73cc))
- fix: :bug: update UPDATE_RATE constant from 100 to 50 for correct timing configuration ([7d95bad](https://github.com/jonpena/vscode-console-warrior-logs/commit/7d95bad))
- fix: :bug: ya la extension coloca el decorador correcto en el archivo correcto ([0285eaf](https://github.com/jonpena/vscode-console-warrior-logs/commit/0285eaf))
- fix: :bug: ya puedo visualizar objectos en el editor con console.log ([a917736](https://github.com/jonpena/vscode-console-warrior-logs/commit/a917736))
- fix: add missing repository field in package.json ([6d44547](https://github.com/jonpena/vscode-console-warrior-logs/commit/6d44547))
- fix: add space before ellipsis in truncateString function for consistency ([548d0ba](https://github.com/jonpena/vscode-console-warrior-logs/commit/548d0ba))
- fix: add src/scripts/ to .vscodeignore to exclude script files from packaging ([19c9212](https://github.com/jonpena/vscode-console-warrior-logs/commit/19c9212))
- fix: change message storage order to prioritize recent messages ([b0c32f5](https://github.com/jonpena/vscode-console-warrior-logs/commit/b0c32f5))
- fix: correct environment variable reference for GitHub token in release workflow ([a17f2e3](https://github.com/jonpena/vscode-console-warrior-logs/commit/a17f2e3))
- fix: correct environment variable reference for GitHub token in release workflow ([c977bf6](https://github.com/jonpena/vscode-console-warrior-logs/commit/c977bf6))
- fix: remove packageManager field from package.json ([df630b3](https://github.com/jonpena/vscode-console-warrior-logs/commit/df630b3))
- fix: remove unnecessary comments in add_version.sh for clarity ([a7b381b](https://github.com/jonpena/vscode-console-warrior-logs/commit/a7b381b))
- fix: remove unused @semantic-release/npm dependency from package.json and package-lock.json ([5b5fbf7](https://github.com/jonpena/vscode-console-warrior-logs/commit/5b5fbf7))
- fix: remove unused npm plugin from semantic release configuration ([0c2353e](https://github.com/jonpena/vscode-console-warrior-logs/commit/0c2353e))
- fix: replace consoleInjectPlugin with vitePlugin in watcherNodeModules ([2f1e34d](https://github.com/jonpena/vscode-console-warrior-logs/commit/2f1e34d))
- fix: revert MAX_MESSAGE_LENGTH and UPDATE_RATE constants to original values ([7a262d0](https://github.com/jonpena/vscode-console-warrior-logs/commit/7a262d0))
- fix: simplify input check in addConsoleWarriorPort command ([3af0c77](https://github.com/jonpena/vscode-console-warrior-logs/commit/3af0c77))
- fix: update @semantic-release/git configuration to include message formatting ([9838cff](https://github.com/jonpena/vscode-console-warrior-logs/commit/9838cff))
- fix: update comments and variable names for clarity in vitePlugin ([e3e7d49](https://github.com/jonpena/vscode-console-warrior-logs/commit/e3e7d49))
- fix: update description for clarity and add package manager information ([31a2ba7](https://github.com/jonpena/vscode-console-warrior-logs/commit/31a2ba7))
- fix: update extension name from console-warrior to console-inject in README and CHANGELOG ([385c243](https://github.com/jonpena/vscode-console-warrior-logs/commit/385c243))
- fix: update import path for isConsoleLogCorrect function to correct location ([6f2026f](https://github.com/jonpena/vscode-console-warrior-logs/commit/6f2026f))
- fix: update links in README for issues and roadmap sections ([27395a6](https://github.com/jonpena/vscode-console-warrior-logs/commit/27395a6))
- fix: update outDir in tsconfig.json for consistency ([80618c7](https://github.com/jonpena/vscode-console-warrior-logs/commit/80618c7))
- fix: update package name and version in package.json for consistency ([bddb33b](https://github.com/jonpena/vscode-console-warrior-logs/commit/bddb33b))
- fix: update package name from console-inject to console-warrior for consistency ([c47710f](https://github.com/jonpena/vscode-console-warrior-logs/commit/c47710f))
- fix: update package.json for consistency and clarity ([a8845dc](https://github.com/jonpena/vscode-console-warrior-logs/commit/a8845dc))
- fix: update plugin import and usage from consoleWarriorPlugin to consoleInjectPlugin ([36425ec](https://github.com/jonpena/vscode-console-warrior-logs/commit/36425ec))
- fix: update plugin name from console-inject-plugin to console-warrior-plugin for consistency ([d6c7345](https://github.com/jonpena/vscode-console-warrior-logs/commit/d6c7345))
- fix: update plugin path and comment out unused test code in vitePlugin ([b99f1a5](https://github.com/jonpena/vscode-console-warrior-logs/commit/b99f1a5))
- fix: update plugin path resolution to use extension path for injection code ([8a5cbab](https://github.com/jonpena/vscode-console-warrior-logs/commit/8a5cbab))
- fix: update regex patterns and improve WebSocket error handling ([870413b](https://github.com/jonpena/vscode-console-warrior-logs/commit/870413b))
- fix: update repository URL and enhance metadata in package.json ([7f38d5e](https://github.com/jonpena/vscode-console-warrior-logs/commit/7f38d5e))
- fix: update semantic release configuration to include package.json in git assets ([52db610](https://github.com/jonpena/vscode-console-warrior-logs/commit/52db610))
- fix: update version and remove unused script from package.json ([78f19a7](https://github.com/jonpena/vscode-console-warrior-logs/commit/78f19a7))
- fix: update version number to 0.0.25 in package.json ([dba8075](https://github.com/jonpena/vscode-console-warrior-logs/commit/dba8075))
- fix: update version number to 1.0.0 in package.json ([76966c4](https://github.com/jonpena/vscode-console-warrior-logs/commit/76966c4))
- fix: update version to 0.0.20 and add command to contributes in package.json ([55ccc2b](https://github.com/jonpena/vscode-console-warrior-logs/commit/55ccc2b))
- fix: update version to 0.0.23 in package.json ([56d210e](https://github.com/jonpena/vscode-console-warrior-logs/commit/56d210e))
- fix: update vscodePath to correct extension directory for console-warrior-plugin ([b2e0f78](https://github.com/jonpena/vscode-console-warrior-logs/commit/b2e0f78))
- docs: :art: changes to pnpm ([900a6d0](https://github.com/jonpena/vscode-console-warrior-logs/commit/900a6d0))
- docs: :art: code structure only ([a0b51eb](https://github.com/jonpena/vscode-console-warrior-logs/commit/a0b51eb))
- docs: :art: code structure only ([7b57961](https://github.com/jonpena/vscode-console-warrior-logs/commit/7b57961))
- docs: :art: code structure. adding constants folder ([a999947](https://github.com/jonpena/vscode-console-warrior-logs/commit/a999947))
- docs: :art: it's working perfectly ([92a6c37](https://github.com/jonpena/vscode-console-warrior-logs/commit/92a6c37))
- docs: :art: jugando un poco con la configurancion del comando ([9c59504](https://github.com/jonpena/vscode-console-warrior-logs/commit/9c59504))
- docs: :construction: Aun no esta listo el MVP. pero ya dio los primeros console.log ([bfbd410](https://github.com/jonpena/vscode-console-warrior-logs/commit/bfbd410))
- docs: :fire: removing dependencies not used ([b737a76](https://github.com/jonpena/vscode-console-warrior-logs/commit/b737a76))
- docs: :fire: replacing pnpm-lock to npm-lock ([d927a57](https://github.com/jonpena/vscode-console-warrior-logs/commit/d927a57))
- docs: :memo: update README.md ([add12a7](https://github.com/jonpena/vscode-console-warrior-logs/commit/add12a7))
- docs: :pushpin: tracking dependencies in package-lock.json ([19e3c32](https://github.com/jonpena/vscode-console-warrior-logs/commit/19e3c32))
- docs: add CONTRIBUTING.md to outline contribution guidelines and standards ([c5df1bf](https://github.com/jonpena/vscode-console-warrior-logs/commit/c5df1bf))
- docs: add Contributor Covenant Code of Conduct to promote a welcoming community ([ab658db](https://github.com/jonpena/vscode-console-warrior-logs/commit/ab658db))
- docs: remove author attribution from README to maintain neutrality ([3c74d57](https://github.com/jonpena/vscode-console-warrior-logs/commit/3c74d57))
- docs: update README to clarify project name and add legal notice ([771ddf4](https://github.com/jonpena/vscode-console-warrior-logs/commit/771ddf4))
- feat: :art: code structure and monitoring changes ([aa866ca](https://github.com/jonpena/vscode-console-warrior-logs/commit/aa866ca))
- feat: :sparkles: add browser launch function using Playwright ([8210887](https://github.com/jonpena/vscode-console-warrior-logs/commit/8210887))
- feat: :sparkles: add CreateProxy, sourceMap, and updateDecorations functions for enhanced proxy hand ([f1b3fa4](https://github.com/jonpena/vscode-console-warrior-logs/commit/f1b3fa4))
- feat: :sparkles: add formatString and truncateString utility functions ([c1ac951](https://github.com/jonpena/vscode-console-warrior-logs/commit/c1ac951))
- feat: :sparkles: add IConsoleData interface to define console data structure ([92b8bfe](https://github.com/jonpena/vscode-console-warrior-logs/commit/92b8bfe))
- feat: :sparkles: add monitoring function to track changes in an array ([3d2eaf7](https://github.com/jonpena/vscode-console-warrior-logs/commit/3d2eaf7))
- feat: :sparkles: add source-map package to dependencies ([f691d2f](https://github.com/jonpena/vscode-console-warrior-logs/commit/f691d2f))
- feat: :sparkles: add testing command to run a script and remove Playwright dependency ([e395263](https://github.com/jonpena/vscode-console-warrior-logs/commit/e395263))
- feat: :sparkles: add utility function to extract filename from URL ([36f9ab6](https://github.com/jonpena/vscode-console-warrior-logs/commit/36f9ab6))
- feat: :sparkles: enhance WebSocket logging with auto-reload commands and improved stack trace handli ([f0369a3](https://github.com/jonpena/vscode-console-warrior-logs/commit/f0369a3))
- feat: :sparkles: enhance WebSocket server configuration and improve error handling in injection scri ([1c703db](https://github.com/jonpena/vscode-console-warrior-logs/commit/1c703db))
- feat: :sparkles: refactor WebSocket handling and enhance console data processing with new utility fu ([cfeb1df](https://github.com/jonpena/vscode-console-warrior-logs/commit/cfeb1df))
- feat: :sparkles: util function ([735ab80](https://github.com/jonpena/vscode-console-warrior-logs/commit/735ab80))
- feat: :zap: new fuction to monitor changes an array ([af9e1ae](https://github.com/jonpena/vscode-console-warrior-logs/commit/af9e1ae))
- feat: add .gitattributes to enforce LF line endings for TypeScript files ([ca53e3f](https://github.com/jonpena/vscode-console-warrior-logs/commit/ca53e3f))
- feat: add .prettierignore to exclude build artifacts and dependencies ([4a1052f](https://github.com/jonpena/vscode-console-warrior-logs/commit/4a1052f))
- feat: add addConsoleWarriorPlugin function to insert Console Warrior plugin into Vite's cli.js ([b8356aa](https://github.com/jonpena/vscode-console-warrior-logs/commit/b8356aa))
- feat: add addConsoleWarriorPort command to configure WebSocket port ([0d7bbd3](https://github.com/jonpena/vscode-console-warrior-logs/commit/0d7bbd3))
- feat: add category to command in package.json for better organization ([a8a4569](https://github.com/jonpena/vscode-console-warrior-logs/commit/a8a4569))
- feat: add checkIfNodeModulesReady utility to verify node_modules readiness ([f6214fe](https://github.com/jonpena/vscode-console-warrior-logs/commit/f6214fe))
- feat: add denque dependency to package.json and pnpm-lock.yaml ([bd63a89](https://github.com/jonpena/vscode-console-warrior-logs/commit/bd63a89))
- feat: add GitHub Actions workflow for automated release process ([001714f](https://github.com/jonpena/vscode-console-warrior-logs/commit/001714f))
- feat: add IBackendConnections type for managing WebSocket connections ([e08a7d9](https://github.com/jonpena/vscode-console-warrior-logs/commit/e08a7d9))
- feat: add IConsoleDataMap type definition for console data mapping ([fd81d43](https://github.com/jonpena/vscode-console-warrior-logs/commit/fd81d43))
- feat: add initial README.md with project description, features, installation, and usage instructions ([cb0dc54](https://github.com/jonpena/vscode-console-warrior-logs/commit/cb0dc54))
- feat: add injection code for enhanced console logging and WebSocket integration ([7d3f33c](https://github.com/jonpena/vscode-console-warrior-logs/commit/7d3f33c))
- feat: add injection code for WebSocket connection and log redirection ([fe75220](https://github.com/jonpena/vscode-console-warrior-logs/commit/fe75220))
- feat: add ISourceMapCache type definition for trace mapping ([68e0384](https://github.com/jonpena/vscode-console-warrior-logs/commit/68e0384))
- feat: add linting and formatting scripts to package.json ([fa8cc1f](https://github.com/jonpena/vscode-console-warrior-logs/commit/fa8cc1f))
- feat: add MAX_DECORATIONS constant to constants file ([c22c973](https://github.com/jonpena/vscode-console-warrior-logs/commit/c22c973))
- feat: add new icon image for enhanced visual representation ([dcd7950](https://github.com/jonpena/vscode-console-warrior-logs/commit/dcd7950))
- feat: add optional 'type' property to IConsoleData interface for enhanced message categorization ([09b8623](https://github.com/jonpena/vscode-console-warrior-logs/commit/09b8623))
- feat: add optional id property to IConsoleData type ([f42089f](https://github.com/jonpena/vscode-console-warrior-logs/commit/f42089f))
- feat: add Prettier configuration file for code formatting ([d280e25](https://github.com/jonpena/vscode-console-warrior-logs/commit/d280e25))
- feat: add removeCommentedConsoles utility to manage console logs in editor ([ccbd0b8](https://github.com/jonpena/vscode-console-warrior-logs/commit/ccbd0b8))
- feat: add script to update version in vitePlugin.js ([d4877b7](https://github.com/jonpena/vscode-console-warrior-logs/commit/d4877b7))
- feat: add script to update version in vitePlugin.js ([c784885](https://github.com/jonpena/vscode-console-warrior-logs/commit/c784885))
- feat: add semantic release configuration for automated versioning and changelog generation ([b3ef731](https://github.com/jonpena/vscode-console-warrior-logs/commit/b3ef731))
- feat: add updateConsoleDataMap function to manage console data mapping ([17f0bba](https://github.com/jonpena/vscode-console-warrior-logs/commit/17f0bba))
- feat: add Vite plugin for console injection and enhance file modification handling ([0247465](https://github.com/jonpena/vscode-console-warrior-logs/commit/0247465))
- feat: add watcherNodeModules utility to monitor node_modules directory ([d071284](https://github.com/jonpena/vscode-console-warrior-logs/commit/d071284))
- feat: add WS_PORT and PROXY_PORT constants to configuration ([f8ade29](https://github.com/jonpena/vscode-console-warrior-logs/commit/f8ade29))
- feat: enable decoration rendering in activate function ([ab64f55](https://github.com/jonpena/vscode-console-warrior-logs/commit/ab64f55))
- feat: enhance console log handling and decoration rendering ([bea2bc8](https://github.com/jonpena/vscode-console-warrior-logs/commit/bea2bc8))
- feat: enhance error handling in sourceMapping by adding getFilename utility for missing source maps ([69e1db8](https://github.com/jonpena/vscode-console-warrior-logs/commit/69e1db8))
- feat: enhance package.json with linting and formatting tools for improved code quality ([062c24f](https://github.com/jonpena/vscode-console-warrior-logs/commit/062c24f))
- feat: enhance WebSocket logging with support for multiple file extensions and improved message seria ([e7fb5c1](https://github.com/jonpena/vscode-console-warrior-logs/commit/e7fb5c1))
- feat: implement broadcastToClients function for WebSocket message distribution ([10dbc07](https://github.com/jonpena/vscode-console-warrior-logs/commit/10dbc07))
- feat: implement connectToCentralWS function for WebSocket connection ([a8cad4a](https://github.com/jonpena/vscode-console-warrior-logs/commit/a8cad4a))
- feat: implement Console Warrior plugin for Vite integration ([4abdbec](https://github.com/jonpena/vscode-console-warrior-logs/commit/4abdbec))
- feat: implement getFilename function to extract filename from URL ([3f7b22a](https://github.com/jonpena/vscode-console-warrior-logs/commit/3f7b22a))
- feat: implement getPortFromUrl utility to extract port from URL strings ([6c8edef](https://github.com/jonpena/vscode-console-warrior-logs/commit/6c8edef))
- feat: implement HTTP proxy server with HTML injection capabilities ([ef050ca](https://github.com/jonpena/vscode-console-warrior-logs/commit/ef050ca))
- feat: implement isConsoleLogCorrect function to validate console.log usage in comments ([cc6fa6e](https://github.com/jonpena/vscode-console-warrior-logs/commit/cc6fa6e))
- feat: implement renderDecorations function for enhanced editor decoration ([c8ed1c5](https://github.com/jonpena/vscode-console-warrior-logs/commit/c8ed1c5))
- feat: implement sourceMapping function to enhance console data processing with source maps ([7777cf2](https://github.com/jonpena/vscode-console-warrior-logs/commit/7777cf2))
- feat: implement startCentralSW function to initialize WebSocket server ([74cba7e](https://github.com/jonpena/vscode-console-warrior-logs/commit/74cba7e))
- feat: implement WebSocket connection handling and server management ([5f57ce5](https://github.com/jonpena/vscode-console-warrior-logs/commit/5f57ce5))
- feat: optimize updateDecorations function by utilizing performance measurement and refactoring conso ([d181fb3](https://github.com/jonpena/vscode-console-warrior-logs/commit/d181fb3))
- feat: refactor console data handling by replacing sourceMap with sourceMapping and optimizing data f ([8f6f0af](https://github.com/jonpena/vscode-console-warrior-logs/commit/8f6f0af))
- feat: refactor consoleDataMap to use arrays instead of sets for improved data handling ([f782879](https://github.com/jonpena/vscode-console-warrior-logs/commit/f782879))
- feat: refactor consoleDataMap to use arrays instead of sets for message storage ([f3877e3](https://github.com/jonpena/vscode-console-warrior-logs/commit/f3877e3))
- feat: refactor createProxy to use PROXY_PORT constant and update WebSocket connection settings ([3477557](https://github.com/jonpena/vscode-console-warrior-logs/commit/3477557))
- feat: refactor WebSocket handling and integrate watcherNodeModules utility ([7ac2c3c](https://github.com/jonpena/vscode-console-warrior-logs/commit/7ac2c3c))
- feat: refactor WebSocket handling and remove unused proxy code ([20d3563](https://github.com/jonpena/vscode-console-warrior-logs/commit/20d3563))
- feat: remove unused command from contributes section in package.json ([9251baa](https://github.com/jonpena/vscode-console-warrior-logs/commit/9251baa))
- feat: update comments in extension.ts for improved clarity and consistency ([3711dd4](https://github.com/jonpena/vscode-console-warrior-logs/commit/3711dd4))
- feat: update IConsoleDataMap type to use Denque for improved data structure ([25f41a5](https://github.com/jonpena/vscode-console-warrior-logs/commit/25f41a5))
- feat: update MAX_MESSAGE_LENGTH constant to increase maximum message size ([6f0ab67](https://github.com/jonpena/vscode-console-warrior-logs/commit/6f0ab67))
- feat: update renderDecorations to use IConsoleDataMap and improve value formatting ([7e522bc](https://github.com/jonpena/vscode-console-warrior-logs/commit/7e522bc))
- feat: update UPDATE_RATE constant to improve message update frequency ([47bafb1](https://github.com/jonpena/vscode-console-warrior-logs/commit/47bafb1))
- feat: update UPDATE_RATE constant to improve update frequency ([3b5dd08](https://github.com/jonpena/vscode-console-warrior-logs/commit/3b5dd08))
- Create LICENSE ([9bba3b9](https://github.com/jonpena/vscode-console-warrior-logs/commit/9bba3b9))
- docs: ([58852ce](https://github.com/jonpena/vscode-console-warrior-logs/commit/58852ce))
- Implement code changes to enhance functionality and improve performance ([a7f441f](https://github.com/jonpena/vscode-console-warrior-logs/commit/a7f441f))
- Implement feature X to enhance user experience and fix bug Y in module Z ([52a6482](https://github.com/jonpena/vscode-console-warrior-logs/commit/52a6482))
- Refactor code structure for improved readability and maintainability ([974d3f8](https://github.com/jonpena/vscode-console-warrior-logs/commit/974d3f8))
- Refactor code structure for improved readability and maintainability ([539e4b5](https://github.com/jonpena/vscode-console-warrior-logs/commit/539e4b5))
- Refactor code structure for improved readability and maintainability ([1998465](https://github.com/jonpena/vscode-console-warrior-logs/commit/1998465))
- Refactor code to use single quotes for strings and improve formatting ([aef6fe7](https://github.com/jonpena/vscode-console-warrior-logs/commit/aef6fe7))
- refactor: ([c75cfc3](https://github.com/jonpena/vscode-console-warrior-logs/commit/c75cfc3))
- Update LICENSE ([27d86e1](https://github.com/jonpena/vscode-console-warrior-logs/commit/27d86e1))
- refactor: :truck: rename funcion to monitoringChanges ([d669859](https://github.com/jonpena/vscode-console-warrior-logs/commit/d669859))
- refactor: :truck: rename funcion to monitoringChanges ([24e2cc4](https://github.com/jonpena/vscode-console-warrior-logs/commit/24e2cc4))
- refactor: capitalize constants in checkIfNodeModulesReady function for consistency ([6d50163](https://github.com/jonpena/vscode-console-warrior-logs/commit/6d50163))
- refactor: change IConsoleData from interface to type for consistency ([9891205](https://github.com/jonpena/vscode-console-warrior-logs/commit/9891205))
- refactor: clean up console log and warning messages in WebSocket handling ([eb76ca1](https://github.com/jonpena/vscode-console-warrior-logs/commit/eb76ca1))
- refactor: clean up extension.ts by removing unused code and improving command registration ([793e19c](https://github.com/jonpena/vscode-console-warrior-logs/commit/793e19c))
- refactor: clean up formatString function by removing unnecessary newline and tab handling ([e6a16de](https://github.com/jonpena/vscode-console-warrior-logs/commit/e6a16de))
- refactor: enhance node_modules handling and cleanup monitorChanges logic ([0ad72f4](https://github.com/jonpena/vscode-console-warrior-logs/commit/0ad72f4))
- refactor: enhance sourceMapCache type definition and reorganize monitorChanges placement ([c70e02f](https://github.com/jonpena/vscode-console-warrior-logs/commit/c70e02f))
- refactor: enhance type safety and improve source map handling in sourceMapping function ([3ecac68](https://github.com/jonpena/vscode-console-warrior-logs/commit/3ecac68))
- refactor: improve command execution and logging in WebSocket activation ([7f98b8b](https://github.com/jonpena/vscode-console-warrior-logs/commit/7f98b8b))
- refactor: improve type definitions and enhance response handling in proxy server ([a75a215](https://github.com/jonpena/vscode-console-warrior-logs/commit/a75a215))
- refactor: improve updateConsoleDataMap to use Denque for message queuing ([b9ad102](https://github.com/jonpena/vscode-console-warrior-logs/commit/b9ad102))
- refactor: move decorationType definition to the top of renderDecorations.ts ([b73202a](https://github.com/jonpena/vscode-console-warrior-logs/commit/b73202a))
- refactor: remove commented-out console logs to clean up code ([f77c3ab](https://github.com/jonpena/vscode-console-warrior-logs/commit/f77c3ab))
- refactor: remove commented-out injectedScript code for cleaner implementation ([f33c161](https://github.com/jonpena/vscode-console-warrior-logs/commit/f33c161))
- refactor: remove console log for cleaner code in sourceMapping function ([2afa4ed](https://github.com/jonpena/vscode-console-warrior-logs/commit/2afa4ed))
- refactor: remove obsolete extension test file ([de61630](https://github.com/jonpena/vscode-console-warrior-logs/commit/de61630))
- refactor: remove unused add_version.sh script ([d21d397](https://github.com/jonpena/vscode-console-warrior-logs/commit/d21d397))
- refactor: remove unused port detection and validation utilities ([6e85760](https://github.com/jonpena/vscode-console-warrior-logs/commit/6e85760))
- refactor: remove updateDecorations function to streamline codebase ([c9cbe93](https://github.com/jonpena/vscode-console-warrior-logs/commit/c9cbe93))
- refactor: remove writeToTerminal utility function ([6c0c614](https://github.com/jonpena/vscode-console-warrior-logs/commit/6c0c614))
- refactor: rename function to consoleWarriorPlugin for consistency ([2fad663](https://github.com/jonpena/vscode-console-warrior-logs/commit/2fad663))
- refactor: rename parameter in isValidPort function for clarity ([aa5b9ea](https://github.com/jonpena/vscode-console-warrior-logs/commit/aa5b9ea))
- refactor: replace forEach with for...of loop for improved readability ([3a299d6](https://github.com/jonpena/vscode-console-warrior-logs/commit/3a299d6))
- refactor: simplify monitoringChanges by using hashArray for change detection ([e41254f](https://github.com/jonpena/vscode-console-warrior-logs/commit/e41254f))
- refactor: streamline addConsoleWarriorPlugin function by improving readability and structure ([2f8a6d8](https://github.com/jonpena/vscode-console-warrior-logs/commit/2f8a6d8))
- refactor: streamline node_modules watcher and plugin activation logic ([af8395c](https://github.com/jonpena/vscode-console-warrior-logs/commit/af8395c))
- refactor: streamline renderDecorations function for improved clarity and performance ([6da8344](https://github.com/jonpena/vscode-console-warrior-logs/commit/6da8344))
- refactor: streamline source mapping logic and enhance error handling ([27c813f](https://github.com/jonpena/vscode-console-warrior-logs/commit/27c813f))
- refactor: streamline WebSocket connection setup and remove unused code ([c606a21](https://github.com/jonpena/vscode-console-warrior-logs/commit/c606a21))
- refactor: update comment to English for consistency ([048e10f](https://github.com/jonpena/vscode-console-warrior-logs/commit/048e10f))
- refactor: update comments in watcherNodeModules for clarity and consistency ([7a5b329](https://github.com/jonpena/vscode-console-warrior-logs/commit/7a5b329))
- refactor: update consoleWarriorPlugin to accept relativePath and enhance watcherNodeModules integrat ([0d4330f](https://github.com/jonpena/vscode-console-warrior-logs/commit/0d4330f))
- refactor: update import path for getFilename utility function ([e79f451](https://github.com/jonpena/vscode-console-warrior-logs/commit/e79f451))
- refactor: update import path for injectionCode and translate comments to English ([a8febd3](https://github.com/jonpena/vscode-console-warrior-logs/commit/a8febd3))
- refactor: update package.json by cleaning up commands and adjusting activation events ([ba30f27](https://github.com/jonpena/vscode-console-warrior-logs/commit/ba30f27))
- refactor: update sourceMapping function to improve clarity and consistency ([b8a1951](https://github.com/jonpena/vscode-console-warrior-logs/commit/b8a1951))
- refactor: update sourceMapping to use TraceMap for improved sourcemap handling ([de616a1](https://github.com/jonpena/vscode-console-warrior-logs/commit/de616a1))
- refactor: update WebSocket connection log messages for clarity ([a17f161](https://github.com/jonpena/vscode-console-warrior-logs/commit/a17f161))
- refactor: update WebSocket connection to use connectToMainWS and remove unused constants ([0960954](https://github.com/jonpena/vscode-console-warrior-logs/commit/0960954))
- refactor: update WebSocket server port and improve console data handling ([d9e8151](https://github.com/jonpena/vscode-console-warrior-logs/commit/d9e8151))
- test: add unit tests for formatString function ([cdda548](https://github.com/jonpena/vscode-console-warrior-logs/commit/cdda548))
- test: add unit tests for getFilename function ([da5aeeb](https://github.com/jonpena/vscode-console-warrior-logs/commit/da5aeeb))
- test: add unit tests for isConsoleLogCorrect function ([f9d548e](https://github.com/jonpena/vscode-console-warrior-logs/commit/f9d548e))
- test: add unit tests for truncateString function ([5207d2c](https://github.com/jonpena/vscode-console-warrior-logs/commit/5207d2c))
- chore: remove CHANGELOG and README files as they are no longer needed ([aa63ad8](https://github.com/jonpena/vscode-console-warrior-logs/commit/aa63ad8))
- chore: remove vsc-extension-quickstart.md as it is no longer needed ([dd93c8f](https://github.com/jonpena/vscode-console-warrior-logs/commit/dd93c8f))
- chore: remove WebSocket server log from proxy startup ([17cf765](https://github.com/jonpena/vscode-console-warrior-logs/commit/17cf765))
- rename: add consoleInjectPlugin to insert Vite integration code into cli.js ([f75fd3c](https://github.com/jonpena/vscode-console-warrior-logs/commit/f75fd3c))
