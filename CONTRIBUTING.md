# Contributing

Bugs, ideas and fixes are all welcome.

## Report an issue

[Open an issue](https://github.com/arnaud-zg/eslint-plugin-feature-flags/issues/new/choose). One
sentence is enough to start; the rule options and the code it reads help but are optional.

## Create a pull request

You need Node 22 or later, pnpm 10.10 or later, and the [GitHub CLI](https://cli.github.com) (or
fork and open the pull request on github.com). For a large change, open an issue first.

**1. Fork, clone and install**

```sh
gh repo fork arnaud-zg/eslint-plugin-feature-flags --clone
cd eslint-plugin-feature-flags
pnpm install
```

**2. Create a branch and make your change**

```sh
git checkout -b fix/short-description
pnpm test
```

Add a test for a fix or a feature. When users will see the change, update the
[plugin README](./packages/eslint-plugin-feature-flags/README.md) and the [docs](./docs/README.md);
an example the docs show lives in `packages/eslint-plugin-feature-flags/examples/`, linted by
`src/examples.test.ts`.

**3. Add a changeset for any change npm users will get**

```sh
pnpm changeset --patch eslint-plugin-feature-flags -m "What now works."       # fix, perf, refactor…
pnpm changeset --minor eslint-plugin-feature-flags -m "What users can now do." # feat, or a breaking change below 1.0.0
```

A change to the plugin README, or to `description` or `keywords` in its `package.json`, is a
`--patch` too: npm only shows them after a release. Changes to `docs/` and tooling need none. Every
case: [Changeset rules](./docs/contributing/reference.md#changeset-rules).

**4. Check, commit and push**

```sh
pnpm verify   # typecheck, lint, format, test, build
git add .
git commit -m "fix(eslint-plugin-feature-flags): short description"
git push -u origin HEAD
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org) with a required scope
(`eslint-plugin-feature-flags` or `repo`); a `commit-msg` hook checks it.

**5. Open the pull request**

```sh
gh pr create
```

- Keep one change per pull request; its title becomes the squashed commit on `main`.
- Say what changes and why, and link the issue (`Closes #123`).
- Run `pnpm verify` before asking for a review: no CI runs it on pull requests.

## Release (maintainer)

Releasing, publishing from GitHub Actions and deprecating a package on npm:
[Contributing how-to](./docs/contributing/how-to.md).
