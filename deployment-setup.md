# Plugin Deployment Setup Guide

This guide explains how to set up automatic deployment of the `stagewise-animation-plugin` package to npm when PRs are merged to the main branch.

## What Was Added

### 1. GitHub Workflow (`.github/workflows/deploy.yml`)
A GitHub Actions workflow that:
- Triggers on pushes to the `main` branch that affect the `packages/plugin/` directory
- Can also be triggered manually via `workflow_dispatch`
- Uses pnpm for package management (matching your project setup)
- Builds the plugin using Turbo
- Checks if the version has changed compared to the published version
- Only publishes to npm if the version is different
- Creates a GitHub release when a new version is published

### 2. Package.json Update
Removed `"private": true` from `packages/plugin/package.json` to allow npm publishing.

## Required Setup

### 1. NPM Token
You need to create an npm access token and add it to your GitHub repository secrets:

1. **Create NPM Token:**
   - Go to [npmjs.com](https://www.npmjs.com) and log in
   - Click on your profile → "Access Tokens"
   - Click "Generate New Token" → "Granular Access Token"
   - Select the appropriate permissions (publish packages)
   - Copy the generated token

2. **Add to GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and Variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: paste your npm token
   - Click "Add secret"

### 2. Package Ownership
Ensure you have publish permissions for the `stagewise-animation-plugin` package on npm:
- If it's a new package, you'll automatically have permissions
- If it exists, make sure you're added as a maintainer/owner

## How It Works

### Automatic Deployment
1. When a PR is merged to `main` branch
2. If changes are made to `packages/plugin/` directory
3. The workflow will:
   - Install dependencies using pnpm
   - Build the plugin using your Turbo setup
   - Compare the current version in `package.json` with the published version on npm
   - If versions differ, publish the new version to npm
   - Create a GitHub release with the new version

### Version Management
- The workflow only publishes when the version in `package.json` changes
- To publish a new version:
  1. Update the `version` field in `packages/plugin/package.json`
  2. Commit and merge the PR to main
  3. The workflow will automatically publish

### Manual Deployment
You can also trigger deployment manually:
1. Go to Actions tab in your GitHub repository
2. Select "Deploy Plugin to NPM" workflow
3. Click "Run workflow" and select the main branch

## Recommended Workflow

1. **Development:**
   - Create feature branches from `main`
   - Make changes to the plugin
   - Test thoroughly

2. **Release:**
   - Update version in `packages/plugin/package.json` (follow semver)
   - Create PR with version bump and changes
   - After code review, merge PR to main
   - Deployment happens automatically

3. **Version Naming:**
   - Use semantic versioning (semver): `MAJOR.MINOR.PATCH`
   - Patch: bug fixes (0.3.0 → 0.3.1)
   - Minor: new features (0.3.0 → 0.4.0)
   - Major: breaking changes (0.3.0 → 1.0.0)

## Workflow Features

- **Smart Publishing:** Only publishes when version changes
- **Caching:** Uses pnpm cache for faster builds
- **Error Handling:** Fails gracefully if publishing fails
- **GitHub Releases:** Automatically creates releases with installation instructions
- **Path Filtering:** Only runs when plugin files change
- **Manual Trigger:** Can be run manually when needed

## Troubleshooting

### Common Issues:
1. **"npm publish failed":** Check if NPM_TOKEN is set correctly
2. **"Version already exists":** Update version in package.json
3. **"Build failed":** Ensure the plugin builds locally first
4. **"No changes detected":** Make sure changes are in packages/plugin/ directory

### Debugging:
- Check the Actions tab for detailed logs
- Verify npm token permissions
- Ensure package builds successfully with `pnpm build --filter=stagewise-animation-plugin`

## Security Notes

- The NPM_TOKEN is stored securely in GitHub Secrets
- The workflow only runs on the main branch
- Manual approval is not required but versions must be bumped manually
- The workflow creates public releases on GitHub

## Next Steps

1. Set up the NPM_TOKEN in GitHub Secrets
2. Test the workflow by updating the plugin version and merging a PR
3. Verify the package is published correctly on npm
4. Monitor the first few deployments to ensure everything works smoothly