// How this repository releases the plugin: `pnpm release` opens the release PR, then publishes.
import { changesetsVersioning, presets } from "@shiplane/changesets";
import { gitSourceControl } from "@shiplane/git";
import { gitHubActionsCiPipeline, gitHubCodeHost } from "@shiplane/github";
import { npmPackageRegistry } from "@shiplane/npm";
import { defineRelease, publishedPackage, releaseFlow } from "shiplane";

export default defineRelease({
  flow: releaseFlow({
    sourceControl: gitSourceControl(),
    codeHost: gitHubCodeHost(),
    ciPipeline: gitHubActionsCiPipeline(),
    versioning: changesetsVersioning({ thanks: presets.none }),
  }),
  modules: [publishedPackage({ packageRegistry: npmPackageRegistry() })],
});
