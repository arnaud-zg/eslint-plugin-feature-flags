# 🚀 eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="Eslint Plugin Feature Flags Logo" />
</p>

<div align="center">
  ESLint plugin to manage feature flags and prevent technical debt
</div>

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Built%20with-Turborepo-blueviolet" alt="Built with Turbo"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

## Table of Contents

- [Overview](#overview)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [License](#license)
- [Learn More](#want-to-learn-more)
- [Acknowledgments](#acknowledgments)

## Overview

Feature flags help teams deploy safely, but often become technical debt when forgotten. This ESLint plugin solves that by:

- **Finding expired flags** that should be removed
- **Preventing undefined flags** to avoid typos and mistakes
- **Automating cleanup** with configurable strategies

Common issues this plugin addresses:

- **Dead flags** bloating the codebase
- **Stale flags** creating ambiguity
- **Hidden logic** behind flags where it doesn't belong
- **Lack of clear ownership** of flags across teams

👉 See the [example project](./examples/test-project/) for a quick demo.

## Development

### Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode
pnpm dev

# Run tests
pnpm test

# Check code quality
pnpm lint
pnpm format
```

## Project Structure

This is a monorepo built with Turborepo:

```
eslint-plugin-feature-flags/
├── apps/
│   └── eslint-plugin/  # Main ESLint plugin package
├── packages/
│   ├── types/          # TypeScript type definitions
│   └── core/           # Shared utilities
├── examples/
│   └── test-project/   # Example implementation
```

## Key Components

- 🔍 **[ESLint Plugin](./apps/eslint-plugin/)** - The main plugin package
- 🧩 **[Core](./packages/core/)** - Shared utilities and logic
- 📝 **[Types](./packages/types/)** - TypeScript definitions
- 🧪 **[Example Project](./examples/test-project/)** - Working example

## License

This project is MIT licensed - see the [LICENSE](LICENSE) file for details.

## Want to Learn More?

Resources on feature flag best practices:

- [Effective Feature Flag Management](https://arnaudzg.substack.com/p/effective-feature-flag-management) - The article that inspired this plugin
- [ESLint Plugin Documentation](./apps/eslint-plugin/README.md) - Full plugin details and examples

## Acknowledgments

Special thanks to [Kevin Marques](https://github.com/marques-kevin) for the idea that sparked this project, and to all contributors who help make it better!

Built with [Turborepo](https://turbo.build/) ⚡️
