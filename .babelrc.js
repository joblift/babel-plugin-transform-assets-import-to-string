module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '8.11',
                },
                ignoreBrowserslistConfig: true,
                modules: 'commonjs',
                useBuiltIns: 'entry',
                corejs: 2,
                loose: false,
                debug: false,
            },
        ],
    ],
};
