import { expect } from 'chai';
import path from 'path';
import transformCode from './transformCode';

function getFixtures(name) {
    return path.resolve(__dirname, 'fixtures', name);
}

describe('index', () => {
    const baseConfig = {
        baseUri: 'http://cdn.address',
        baseDir: '/assets',
    };

    it('should replace import statements with uri', () => {
        const result = transformCode(getFixtures('import-image.js'), baseConfig).code;

        expect(result).to.equal('const test = "http://cdn.address/assets/path/to/icon.svg";');
    });

    it('should let you flatten the file path', () => {
        const config = { ...baseConfig, flatten: true };
        const result = transformCode(getFixtures('import-image.js'), config).code;

        expect(result).to.equal('const test = "http://cdn.address/assets/icon.svg";');
    });

    it('should replace import statements with uri and hash suffix of content', () => {
        const config = { ...baseConfig, hash: 'suffix', baseDir: '/' };
        const result = transformCode(getFixtures('import-uri-hash.js'), config).code;

        expect(result).to.equal('const test = "http://cdn.address/icon.svg?80c59330";');
    });

    it('should replace import statements with uri and hash of content s filename', () => {
        const config = { ...baseConfig, hash: true, baseDir: '/' };
        const result = transformCode(getFixtures('import-uri-hash.js'), config).code;

        expect(result).to.equal('const test = "http://cdn.address/80c59330e4b57f48e2f365dcb95140d9350bb816.svg";');
    });

    it('should replace import statements with uri when base uri and dir not defined', () => {
        const result = transformCode(getFixtures('import-image.js')).code;

        expect(result).to.equal('const test = "icon.svg";');
    });

    it('should replace import statements with uri when base dir not defined', () => {
        const result = transformCode(getFixtures('import-image.js'), {
            baseUri: baseConfig.baseUri,
        }).code;

        expect(result).to.equal('const test = "http://cdn.address/icon.svg";');
    });

    it('should replace require statements with uri', () => {
        const result = transformCode(getFixtures('require-image.js'), baseConfig).code;

        expect(result).to.equal('const test = "http://cdn.address/assets/path/to/icon.svg";');
    });

    it('should do nothing when imports have no extensions', () => {
        const result = transformCode(getFixtures('import-no-ext.js')).code;

        expect(result).to.equal("import test from 'something';");
    });

    it('should do nothing when require have no extensions', () => {
        const result = transformCode(getFixtures('require-no-ext.js')).code;

        expect(result).to.equal("const test = require('something');");
    });

    it('should do nothing when not a require assignment', () => {
        const result = transformCode(getFixtures('require-var.js')).code;

        expect(result).to.equal("const test = 'something';");
    });

    it('should hash filename', () => {
        const config = { ...baseConfig, hash: 'filename', baseUri: '', baseDir: '' };
        const result = transformCode(getFixtures('import-icon.js'), config).code;

        expect(result).to.equal('const test = "80c59330e4b57f48e2f365dcb95140d9350bb816.svg";');
    });

    it('should replace baseUri from env', () => {
        const config = { ...baseConfig, envName: 'ASSET_BASE' };
        const result = transformCode(getFixtures('import-image.js'), config).code;

        expect(result).to.equal('const test = (process.env.ASSET_BASE || "") + "/assets/path/to/icon.svg";');
    });
});
