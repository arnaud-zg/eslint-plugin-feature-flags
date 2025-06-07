# 🚀 eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="Eslint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin to enforce feature flag hygiene and prevent technical debt by automatically detecting expired flags.</b>
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

## 🌱 Why This Project Exists

This project was born from an article I wrote on [Effective Feature Flag Management](https://arnaudzg.substack.com/p/effective-feature-flag-management), which explored common challenges in feature flag maintenance.

In my experience, feature flags often start with good intentions but can quickly become sources of technical debt. Common issues include:

- **Dead flags** bloating the codebase
- **Stale flags** creating ambiguity
- **Hidden logic** behind flags where it doesn't belong
- **Lack of clear ownership** of flags across teams

After publishing the article, a discussion with Kevin Marques sparked the idea: *"What if we created a lint rule that automatically triggers an error when a feature flag's expiration date is exceeded? Your CI/CD could run the script, and your IDE would show you in the code where the feature flag is used."*

This insight led to bootstrapping this project to:

1. Provide automated enforcement of feature flag hygiene
2. Integrate directly with existing developer workflows
3. Create visibility around outdated flags
4. Encourage good practices like setting clear expirations

The goal is to build a solution that addresses a wide range of use cases while remaining flexible enough to adapt to different team workflows. I'm open to suggestions and insights from others as we refine this tool together.

📋 **Looking for examples?** Check out our [example project](./examples/test-project/) that demonstrates how to use this plugin with both TypeScript and JavaScript files.

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
│   └── core/            # 🧩 Utilities for feature flag lifecycle
├── examples/
│   └── test-project/    # 🧪 Example usage with TypeScript and JavaScript
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
  - 🧩 [Core](./packages/core/) — Rules for managing the lifecycle of feature flags

- **Examples**
  - 🧪 [Test Project](./examples/test-project/) — Example project demonstrating plugin usage with TypeScript and JavaScript

---

## 📄 License

See the [LICENSE](LICENSE) file for details.

---

## 📚 Further Reading

- [Effective Feature Flag Management](https://arnaudzg.substack.com/p/effective-feature-flag-management) - The article that inspired this project

---

## 🙏 Acknowledgments

Built with [Turborepo](https://turbo.build/)
