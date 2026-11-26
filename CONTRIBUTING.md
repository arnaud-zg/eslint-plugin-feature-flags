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

Add a test for a fix or a feature, and update the
[plugin README](./packages/eslint-plugin-feature-flags/README.md) when users will see the change.

**3. Add a changeset for any change to the plugin's `src`**

```sh
pnpm changeset --patch eslint-plugin-feature-flags -m "What now works."       # fix, perf, refactor…
pnpm changeset --minor eslint-plugin-feature-flags -m "What users can now do." # feat, or a breaking change below 1.0.0
```

Docs-only and tooling changes need none.

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

Releases go through [shiplane](https://www.npmjs.com/package/shiplane) and
[Changesets](https://github.com/changesets/changesets). Nobody pushes to `main` directly.

```sh
git checkout main && git pull
pnpm shiplane status   # what is pending
pnpm release           # with changesets pending: opens the release PR
```

Merge the release PR, then run `pnpm release` again on `main`: it tags the version, publishes it to
npm and writes the GitHub Release from the `CHANGELOG.md` entry. It needs `gh` and `npm` signed in.

### Publish from GitHub Actions

`pnpm release` and `pnpm shiplane test-release` ask: GitHub Actions or this machine. GitHub Actions
runs [ship.yml](./.github/workflows/ship.yml), written by `shiplane doctor`, which keeps its pin on
the installed shiplane version. Start it yourself, with **dry-run** to only look:

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

After a shiplane upgrade, run `pnpm shiplane doctor` to move the pin.
