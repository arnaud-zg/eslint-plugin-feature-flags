[🏠 Home](../../README.md) · [📚 Docs](../README.md) · Contributing: **🛠️ How-to** ·
[📖 Reference](./reference.md) · [💡 Explanation](./explanation.md)

# 🛠️ How-to guides: Contributing

Your first pull request is walked through in [CONTRIBUTING.md](../../CONTRIBUTING.md). These are the
maintainer's tasks.

- [Run this repo's checks](#run-this-repos-checks)
- [Release a new version](#release-a-new-version)
- [Publish from GitHub Actions](#publish-from-github-actions)
- [Add an example the docs show](#add-an-example-the-docs-show)
- [Keep the package findable](#keep-the-package-findable)
- [Deprecate a package on npm](#deprecate-a-package-on-npm)

## Run this repo's checks

```sh
pnpm install
pnpm verify   # typecheck, lint, lint:md, format:check, test, build
```

No CI runs it on pull requests: run it before asking for a review.

## Release a new version

Releases go through [shiplane](https://www.npmjs.com/package/shiplane), with
[Changesets](https://github.com/changesets/changesets) for the version. Nobody pushes to `main`
directly.

1. Each pull request that changes the package carries its changeset (see
   [Changeset rules](./reference.md#changeset-rules)).
2. On `main`, with changesets pending, open the release pull request:

   ```sh
   git checkout main && git pull
   pnpm shiplane status   # what is pending
   pnpm release           # opens the release PR
   ```

3. Merge it, then run `pnpm release` again on `main`. It tags the version, publishes it to npm and
   writes the GitHub Release from the `CHANGELOG.md` entry. It needs `gh` and `npm` signed in.

## Publish from GitHub Actions

`pnpm release` and `pnpm shiplane test-release` ask: GitHub Actions or this machine. GitHub Actions
runs `.github/workflows/ship.yml`, written by `shiplane doctor`. Start it yourself, with **dry-run**
to only look:

```sh
gh workflow run ship.yml --ref main -f environment=nightly -f dry-run=true
```

| Environment                      | Branch | npm gets                                       |
| -------------------------------- | ------ | ---------------------------------------------- |
| `snapshot`                       | any    | `<next>-<branch>.<sha>`, no tag kept           |
| `nightly`, `alpha`, `beta`, `rc` | `main` | `<next>-<channel>.<n>` under that tag          |
| `latest`                         | `main` | the merged release PR's version under `latest` |

One-time setup, from your own terminal (npm asks for 2FA): trust the workflow, so it publishes with
no token.

```sh
npx -y npm@^11.21.0 trust github eslint-plugin-feature-flags --file ship.yml \
  --repo arnaud-zg/eslint-plugin-feature-flags --allow-publish -y
```

After a shiplane upgrade, run `pnpm shiplane doctor`: it moves the pin in `ship.yml`.

## Add an example the docs show

1. Add the file to `packages/eslint-plugin-feature-flags/examples/`, importing the plugin by its npm
   name, as
   [examples/cleanup.config.js](../../packages/eslint-plugin-feature-flags/examples/cleanup.config.js)
   does.
2. Lint it in `src/examples.test.ts`, with what ESLint reports or what `--fix` writes.
3. Link the file from the page; never paste a copy that no test runs.

## Keep the package findable

When you change the package README, or `description` or `keywords` in its `package.json`:

1. Check the change against the [Findability rules](./reference.md#findability-rules).
2. Add a patch changeset:

   ```sh
   pnpm changeset --patch eslint-plugin-feature-flags -m "Clearer npm description and keywords."
   ```

3. After the release, check what npm shows:

   ```sh
   npm view eslint-plugin-feature-flags description keywords
   ```

## Deprecate a package on npm

When a package stops being published, deprecate it rather than unpublish it: old versions that
depend on it keep installing.

```sh
npm whoami
npm deprecate <package> "No longer maintained; <what to use instead>."
npm view <package> deprecated
```

An empty message (`npm deprecate <package> ""`) undoes it.
