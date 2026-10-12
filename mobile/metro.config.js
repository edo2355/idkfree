const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Seguir symlinks (mobile/shared -> ../shared)
config.resolver.unstable_enableSymlinks = true;

// Vigilar también la carpeta padre (donde vive shared/)
config.watchFolders = [workspaceRoot];

// Buscar node_modules en ambos sitios
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
