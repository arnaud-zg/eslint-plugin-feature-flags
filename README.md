# eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="Eslint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin to help manage feature flags and detect flags that should be removed based on their expiration dates.</b>
</div>

`eslint-plugin-feature-flags` provides rules to enforce feature flag hygiene in your codebase. Currently, it includes a rule to detect expired feature flags that should be removed, based on declarative configuration.

---

## Documentation

- [Usage Guide](docs/USAGE.md) - How to install and use the plugin
- [API Reference](docs/API.md) - Detailed API information
- [Contributing](CONTRIBUTING.md) - How to contribute to this project

## Monorepo Structure

This project is set up as a monorepo using pnpm and Turborepo. The structure is:

```
eslint-plugin-feature-flags/
├── apps/               # Application packages
├── packages/           # Library packages
├── pnpm-workspace.yaml # Workspace configuration
├── turbo.json          # Turborepo configuration
└── package.json        # Root package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/) (v7 or later recommended)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development Workflow

```bash
# Run development servers for all apps
pnpm dev

# Build all packages and apps
pnpm build

# Run tests across the entire monorepo
pnpm test

# Run linting across the entire monorepo
pnpm lint

# Format code
pnpm format
```

### Adding a New Package

To add a new package:

1. Create a new directory in `packages/` or `apps/`
2. Initialize the package with `pnpm init`
3. Install dependencies as needed
4. Add scripts that correspond to the Turborepo pipeline

## License

See the [LICENSE](LICENSE) file for details.
