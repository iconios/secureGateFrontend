const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 1. Find the project root and the monorepo root
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..'); // Adjust up if your nesting is deeper

const config = getDefaultConfig(projectRoot);

// 2. Tell Metro to watch the shared code and your global node_modules
config.watchFolders = [
  projectRoot,
  path.resolve(monorepoRoot, 'packages'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force Metro to resolve dependencies from the local folder first, then the root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 4. (Optional) If you are using pnpm, unlock symlink support
config.resolver.unstable_enableSymlinks = true; 

module.exports = config;