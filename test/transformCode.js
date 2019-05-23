import { transformFileSync } from '@babel/core';
import path from 'path';

const plugin = path.join(path.resolve(__dirname, '..', 'src'), 'index.js');

const transformCode = (file, config = {}) => {
    const babelOptions = {
        babelrc: false,
        presets: [],
        plugins: [[plugin, config]],
    };

    return transformFileSync(file, babelOptions);
};

export default transformCode;
