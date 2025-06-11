# 🚀 eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="Eslint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin for feature flag hygiene and prevent technical debt</b>
</div>

---

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Built%20with-Turborepo-blueviolet" alt="Built with Turbo"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

## 🌱 Why I Built This

I've seen codebases with forgotten feature flags. The most common case: you ship a feature behind a feature flag, it works great, you enable it for all users, and then the flag never gets removed.

In my experience, feature flags often start with good intentions but can quickly become sources of technical debt. Common issues include:

- **Dead flags** bloating the codebase
- **Stale flags** creating ambiguity
- **Hidden logic** behind flags where it doesn't belong
- **Lack of clear ownership** of flags across teams

After writing about [feature flag management](https://arnaudzg.substack.com/p/effective-feature-flag-management) and seeing the response, I received a comment from Kevin Marques that said "What if ESLint could just tell you when a flag expires?". That comment inspired me to create this ESLint plugin. It handles the lifecycle of feature flags and alerts you when flags have expired and need cleaning up.

Want to see it in action? Check out the [example project](./examples/test-project/) with both TypeScript and JavaScript demonstrations.

---

## Development

### Commands

- `pnpm install` - Install dependencies
- `pnpm build` - Build all packages
- `pnpm dev` - Run in development mode
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm format` - Format code

### How It's Organized

Here's a quick tour of the project:

```
eslint-plugin-feature-flags/
├── apps/
│   └── eslint-plugin/  # 🔍 The plugin you'll install in your projects
├── packages/
│   ├── types/          # 📝 TypeScript definitions to keep things type-safe
│   └── core/           # 🧩 Shared utilities for handling feature flags
├── examples/
│   └── test-project/   # 🧪 Try it out with these demo files
└── docs/               # 📚 Additional documentation
```

### Where to Look

- 🔍 **[ESLint Plugin](./apps/eslint-plugin/)** - This is the main package you'll install
- 🧩 **[Core](./packages/core/)** - Behind-the-scenes utilities that power the plugin
- 📝 **[Types](./packages/types/)** - TypeScript goodness for strong typing
- 🧪 **[Example Project](./examples/test-project/)** - See real examples that demonstrate both good and bad patterns

---

## 📄 License

This project is MIT licensed - see the [LICENSE](LICENSE) file for all the details.

---

## 📚 Want to Learn More?

If you're interested in feature flag best practices:

- [Effective Feature Flag Management](https://arnaudzg.substack.com/p/effective-feature-flag-management) - The article that inspired this plugin

---

## 🙏 Thanks!

Special thanks to Kevin Marques for the idea that sparked this project, and to all the maintainers and contributors who help make it better!

Built with [Turborepo](https://turbo.build/) ⚡️
