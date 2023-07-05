import { Stats, existsSync, lstatSync, mkdirSync, readlinkSync, renameSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

//@ts-ignore
const NPMRC_STORE = process.env.NPMRC_STORE || join(process.env.HOME || process.env.USERPROFILE, '.npmrcs');
//@ts-ignore
const NPMRC = process.env.NPMRC || join(process.env.HOME || process.env.USERPROFILE, '.npmrc');

function makeStore() {
    try {
        if (!statSync(NPMRC_STORE).isDirectory()) {
            throw new Error(`${NPMRC_STORE} is not a directory.`);
        }
    } catch (e) {
        let defaultNpmrc = join(NPMRC_STORE, 'default');
        console.log('Creating %s', NPMRC_STORE);
        mkdirSync(NPMRC_STORE);

        if (existsSync(NPMRC)) {
            console.log(`${NPMRC} will be created as default NPMRC.`);
            renameSync(NPMRC, defaultNpmrc);
        } else {
            writeFileSync(defaultNpmrc, '');
        }
        switchNpmrc('default')

    }
}

function switchNpmrc(name: string) {
    let npmrcLocation = join(NPMRC_STORE, name || '');
    let currentNpmrc;

    if (!existsSync(`${NPMRC_STORE}/${name}`)) {
        throw new Error(`An NPMRC with name: ${name} is not available. Please make sure to create it first.`);
    }

    try {
        currentNpmrc = lstatSync(NPMRC);
    } catch (exception) {
        throw exception;
    }

    if (!currentNpmrc.isSymbolicLink()) {
        throw new Error(`Current .npmrc is not a symlink. Please create an entry in ${NPMRC_STORE} with this. Or remove it yourself`);
    }

    if (currentNpmrc) {
        console.log(`Deactivating old NPRMC ${basename(readlinkSync(NPMRC))}`);
        unlinkSync(NPMRC)
    }

    console.log(`Activate new NPMRC ${basename(npmrcLocation)}`);
    symlinkSync(npmrcLocation, NPMRC, 'file')
}




export {
    NPMRC,
    NPMRC_STORE,
    makeStore,
    switchNpmrc,
}