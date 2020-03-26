module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '10',
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
