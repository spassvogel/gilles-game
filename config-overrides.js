// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }

    if (process.env.NODE_ENV !== 'production'){
        config.plugins.push(
            new webpack.ProvidePlugin({
                PIXI: 'pixi.js' // Needed for PIXI devtools
            }),
        );
    }

    return config;
}