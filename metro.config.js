const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: path.join(__dirname, 'global.css'),
  configPath: path.join(__dirname, 'tailwind.config.js')
});