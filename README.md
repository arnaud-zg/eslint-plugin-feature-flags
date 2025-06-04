# 🚀 eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="Eslint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin to help manage feature flags and detect flags that should be removed based on their expiration dates.</b>
</div>

---

<div align="center">
  
  <!-- Badges -->
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Built%20with-Turborepo-blueviolet" alt="Built with Turbo"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

---

## ✨ What is eslint-plugin-feature-flags?

`eslint-plugin-feature-flags` provides rules to enforce feature flag hygiene in your codebase. It detects expired feature flags that should be removed based on declarative configuration, helping teams maintain clean code and technical debt management.

---

## 🛠️ Development

### Common Commands

- `pnpm install` — Install dependencies
- `pnpm build` — Build all packages
- `pnpm dev` — Run in development mode
- `pnpm test` — Run tests
- `pnpm lint` — Run linting across the entire monorepo
- `pnpm format` — Format code

### Monorepo Structure

```
eslint-plugin-feature-flags/
├── apps/
│   └── eslint-plugin/  # 🔍 The main ESLint plugin package
├── packages/
│   ├── types/           # 📝 TypeScript typings
│   └── expiration-utils/  # 🧩 Utilities for handling expiration dates
├── docs/                # 📚 Documentation
├── pnpm-workspace.yaml  # Workspace configuration
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json
```

### Directory Links

- **Apps**

  - 🔍 [ESLint Plugin](./apps/eslint-plugin/) — The main ESLint plugin package

- **Packages**
  - 📝 [Types](./packages/types/) — TypeScript type definitions
  - 🧩 [Expiration Utils](./packages/expiration-utils/) — Date handling utilities

---

## 📄 License

See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with [Turborepo](https://turbo.build/)
