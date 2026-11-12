# Origin CI

GitHub Actions is not running on this account (billing lock). Continuous integration for this repo is the Depot workflow at [`.depot/workflows/ci.yml`](../.depot/workflows/ci.yml). Depot runs that GitHub Actions-syntax file on `depot-ubuntu-24.04` after the repository is detached from GitHub.

Triggers: every pull request, and every push to `master` (the default branch). Installs are locked with `npm ci` against `package-lock.json` and, for the Angular app, `web/package-lock.json`. Node is 20, the same major as the Docker image and the existing Actions workflows.

The files under [`.github/workflows/`](../.github/workflows/) stay in the tree. They target `main`, which is not this repo's default branch, and they will not run once the repo leaves GitHub.

## Workflow map

| GitHub workflow | What it runs | Depot job | Command |
| --- | --- | --- | --- |
| `ci.yml` | Server install and build, then the Angular production build | `build` | `npm ci`, `npm run build`, then in `web/`: `npm ci`, `npm run build -- --configuration=production` |
| (not a separate Actions workflow; required here) | Node test suite. `npm test` builds, then `node --test tests`. The old `tests/**/*.test.js` glob does not expand under `/bin/sh`, so the suite never started | `test` | `npm ci`, `npm test` |
| `contract-tests.yml` | Tool handlers match the shared contracts | `contract-tests` | `npm ci`, `npm run contract:test` |
| `seam-validation.yml` jobs `validate-contracts`, `lint-contracts` | Structure, versions, and Zod lint. `npm run validate:all` is `validate:contracts`, `validate:versions`, and `lint:contracts` | `validate` | `npm ci`, `npm run validate:all` |
| `seam-validation.yml` job `verify-two-strike-rule` | Warns on files fixed 3+ times in recent history. The script does not fail the job | `validate` | `node scripts/check-two-strike-violations.mjs` |
| `seam-validation.yml` job `check-breaking-changes` (pull requests only) | Builds contract `dist` on the base ref and on the head SHA, then compares them. The script warns and does not fail the job | `validate` | `node scripts/detect-contract-breaking-changes.mjs /tmp/base-contracts/dist contracts/tool-contracts/dist` |
| `docker-publish.yml` | Image build only. The GHCR push is not ported | `docker-build` | `docker build -t metamorphic-mixtape:ci .` |
| `seam-docs.yml` | Pull-request comment via `actions/github-script` | none | dropped |
| `rosentic.yml` | `Rosentic/rosentic-action` | none | dropped |

`seam-validation.yml` also installs `yamllint` and never invokes it. That apt step is not in the Depot workflow. Contract lint is `node scripts/lint-zod-contracts.mjs`, already run by `npm run validate:all`.

## Dropped because they are GitHub-only

### GHCR publish (`docker-publish.yml`)

The workflow logs into `ghcr.io` with `github.actor` and `secrets.GITHUB_TOKEN`, then pushes `ghcr.io/<owner>/<repo>:latest` and `ghcr.io/<owner>/<repo>:<sha>` on `v*.*.*` tags and on manual dispatch. `GITHUB_TOKEN` is an Actions installation token with `packages: write`. It is not a secret stored in the repo, and it will not exist after detach. QEMU and Buildx were only there for that push.

Depot's `docker-build` job builds the image and stops. It does not log in and does not push.

Publish somewhere else before deploying. `scripts/deploy-digitalocean.sh` takes an image reference and ships the DigitalOcean app spec; it does not build or push. After detach, build with the Depot job (or `docker build -t metamorphic-mixtape:local .` from the README), tag the result for the registry the app pulls, and push with that registry's own credentials. Point the image in `infra/digitalocean/app-spec.yaml` at that registry. GitHub Container Registry is the old target, not the Depot one.

### Rosentic (`rosentic.yml`)

`Rosentic/rosentic-action@v1` is a GitHub Action (`mode: audit`, `scan-mode: pr`). It needs `pull-requests: write` and the Actions checkout. There is no local command to port. The check is dropped.

### Seam-docs pull-request comment (`seam-docs.yml`)

`node scripts/generate-contract-docs.mjs` only prints a contract overview. The workflow's real step posts that text with `actions/github-script` and `github.rest.issues.createComment`. That API call is GitHub-only and is dropped. Run the generator locally when you want the overview. Origin review comments are the separate Grok job below, not a substitute for this report.

## AI review

On pull requests, job `ai-review` runs `node scripts/ai-review.mjs`.

- No `XAI_API_KEY`: the script logs `AI review skipped` and exits 0.
- Key present: it sends the diff against `origin/<base>` (default `master`) to `https://api.x.ai/v1/chat/completions` as `grok-4.5`.
- It posts with `origin pr comment <PR_NUMBER> --body-file ... --edit-last --create-if-none`, using `github.event.pull_request.number` as `PR_NUMBER`.
- Origin CLI missing, or the comment command failing: the review is printed to the log and the process exits 0.
- An xAI HTTP error with a key set still fails the job.

## Secrets to enter in Depot

| Secret | Required | Used by |
| --- | --- | --- |
| `XAI_API_KEY` | No. The review job stays green without it | `ai-review` |

No other name in `.github/workflows/` is a user-managed secret. Do not recreate `GITHUB_TOKEN` in Depot.

`DIGITALOCEAN_ACCESS_TOKEN` is read by `scripts/deploy-digitalocean.sh` when someone deploys by hand. CI does not deploy, so that token is not a Depot CI secret unless a deploy job is added later. A registry password for image publish is also new work; GitHub Actions never stored one.
