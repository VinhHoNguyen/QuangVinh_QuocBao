// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg');

module.exports = config;