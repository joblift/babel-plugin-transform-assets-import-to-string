import crypto from 'crypto';
import fs from 'fs';

function fileHash(fp, absPath, options) {
    if (!options.hash) {
        return fp;
    }

    // eslint-disable-next-line no-sync
    const content = fs.readFileSync(absPath);
    const hash = crypto
        .createHash('sha1')
        .update(content)
        .digest('hex');

    if (options.hash === 'suffix') {
        return `${fp}?${hash.slice(0, 8)}`;
    }

    const splittedFP = fp.split('/');
    const fileName = splittedFP.pop();
    const splittedName = fileName.split('.');
    const ext = splittedName.pop();

    splittedFP.push(`${hash}.${ext}`);

    return splittedFP.join('/');
}

export default fileHash;
