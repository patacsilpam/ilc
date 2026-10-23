const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Ensure Metro watches the shared packages in the monorepo
config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = false;

// In a monorepo where `expo` is hoisted to root `node_modules/expo/AppEntry.js`,
// its relative `import App from '../../App'` looks at workspaceRoot/App instead of apps/mobile/App.
// Redirect that lookup to `apps/mobile/App.tsx`.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '../../App' &&
    context.originModulePath &&
    context.originModulePath.includes(path.join('expo', 'AppEntry'))
  ) {
    return context.resolveRequest(
      context,
      path.resolve(projectRoot, 'App'),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
