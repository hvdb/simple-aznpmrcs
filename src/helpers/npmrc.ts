
import * as fs from 'fs';
import { execSync } from 'child_process';
import { join, basename, resolve } from 'path';
import { createPat, revokePat } from './azureDevopsAPI';
import { NPMRC, NPMRC_STORE, makeStore, switchNpmrc } from './npmrcs/init';

function deleteNpmrc(name: string) {
    console.log('Deleting', name);
    if (fs.existsSync(`${NPMRC_STORE}/${name}`)) {
        fs.unlinkSync(`${NPMRC_STORE}/${name}`);
        console.log(`NPMRC with name ${name} is deleted.`);
    } else {
        throw new Error(`Provided npmrc(${name}) does not exist.`);
    }
}

function listNpmrcs() {
    const currentSelectedNpmrc = fs.readlinkSync(NPMRC);
    fs.readdirSync(NPMRC_STORE).forEach(function (npmrc) {
        if (npmrc[0] !== '.') {
            console.log(' %s %s', basename(currentSelectedNpmrc) == npmrc ? '*' : ' ', npmrc)
        }
    })
}

function useNpmrc(name?: string) {
    if (!name) {
        // If there is no name we use the current directory name as name.
        name = basename(resolve());
    }

    if (!fs.existsSync(`${NPMRC_STORE}/${name}`)) {
        console.log('Provided NPMRC does not exists yet. Please create it first.');
        throw new Error('Provided NPMRC does not exists yet. Please create it first.');
    }
    switchNpmrc(name);
}

function createNpmrcs(feed: string, azProject?: string, azOrg?: string, name?: string) {
    if (!name) {
        // If there is no name we use the current directory name as name.
        name = basename(resolve());
    }
    if (!azOrg || !azProject) {
        // No AZ org or project defined. Check if they are provided in the package.json.

        const pkgJson = JSON.parse(fs.readFileSync('package.json').toString());
        if (pkgJson.repository && pkgJson.repository.url && pkgJson.repository.url.includes('dev.azure.com')) {
            let repositoryUrl;
            if (pkgJson.repository.url.includes('ssh://')) {
                azOrg = pkgJson.repository.url.split('/')[3];
                azProject = pkgJson.repository.url.split('/')[4];
            } else {
                repositoryUrl = new URL(pkgJson.repository.url);
                azOrg = repositoryUrl.pathname.split('/')[1];
                azProject = repositoryUrl.pathname.split('/')[2];
            }
            if (!azOrg || !azProject) {
                throw new Error(`No azOrganization and/or azProject is provided and repository url defined in your package.json cannot be used.\n
                Please provided the parameters or update your package.json with a valid url`);
            }
        } else {
            throw new Error(`No azOrganization and/or azProject is provided and no valid repository url is defined in your package.json.\n
             Please provided the parameters or update your package.json`);
        }
    }

    console.log(`Going to create npmrc: ${name} with details: feed(${feed}) and organization(${azOrg}) project(${azProject})`)

    // load template for azure
    const template = fs.readFileSync(join(__dirname, '../../assets/npmrc-azure-feeds')).toString();

    if (!fs.existsSync(`${NPMRC_STORE}`)) {
        // npmrc_store does not exist, we need to create it first.
        console.log('Initializing NPMRC store and creating default npmrc based on current');
        makeStore();
        console.log('Your previous NPMRC is now available under the name: default');
    }

    if (!fs.existsSync(`${NPMRC_STORE}/${name}`)) {
        console.log('Creating NPMRC', name);
        // Now we update the template with the feed.
        let newNpmrc = template.replaceAll('$NPM_FEED', feed);
        newNpmrc = newNpmrc.replaceAll('$AZ_PROJECT', azProject);
        newNpmrc = newNpmrc.replaceAll('$AZ_ORG', azOrg);
        // Save the npmrc so that it can be used.
        fs.writeFileSync(`${NPMRC_STORE}/${name}`, newNpmrc);
    }
    updateNpmrcWithNewPat(name);
    useNpmrc(name);
}

function updateNpmrcWithNewPat(npmrcName?: string, all?: boolean) {
    // NPMRC file exists let's update it with a new password.
    let files: string[] = [];

    if (!npmrcName && !all) {
        const currentSelectedNpmrc = fs.readlinkSync(NPMRC);
        console.log('Updating currently selected NPMRC', basename(currentSelectedNpmrc));
        files = [basename(currentSelectedNpmrc)];
    } else if (npmrcName && !all) {
        console.log('Updating provided npmrc:', npmrcName);
        files = [npmrcName];
    } else if (all) {
        console.log('Updating all npmrcs');
        files = fs.readdirSync(`${NPMRC_STORE}`);
    }

    files.map((file) => {

        // check if file exists, else throw warning.
        if (fs.existsSync(`${NPMRC_STORE}/${file}`)) {

            // Load the npmrc file
            let npmrc = fs.readFileSync(`${NPMRC_STORE}/${file}`).toString();
            // Determine az organization
            const registryUrl = npmrc.substring(npmrc.indexOf('registry=https://pkgs.dev.azure.com/') + 9, npmrc.indexOf('\n'));
            const url = new URL(registryUrl);
            const azOrganization = url.pathname.split('/')[1];

            // Check if there is an authorizationId, if so we need to revoke it first.
            const authIdIsThere = npmrc.includes('#simple-aznpmrcs#');

            if (authIdIsThere) {
                console.debug('AuthorizationID was found, revoke PAT.');
                // We need to revoke and regenerate
                const authId = npmrc.substring(npmrc.indexOf('#simple-aznpmrcs#') + 17, npmrc.lastIndexOf('#simple-aznpmrcs#'));

                revokePat(azOrganization, authId)
                npmrc = npmrc.replace(`#simple-aznpmrcs#${authId}#simple-aznpmrcs#`, '');
            }

            // create new PAT
            const patToken = createPat(azOrganization, `${file}_feed`);
            const authorizationId = patToken.authorizationId;

            const base64 = Buffer.from(patToken.token.trim()).toString('base64');
            const matches = npmrc.matchAll(/:_password=.*/g);

            for (const match of matches) {
                npmrc = npmrc.replace(match[0], `:_password=${base64}`);
            }
            // We need to add the authorizationId so that we can revoke it later on.
            npmrc = npmrc + `#simple-aznpmrcs#${authorizationId}#simple-aznpmrcs#`;

            fs.writeFileSync(`${NPMRC_STORE}/${file}`, npmrc);
            console.log('NPMRC is updated with a fresh new PAT, happy coding!');
        } else {
            throw new Error(`The provided npmrc(${file}) does not exists. Make sure to first create it via 'create'`);
        }
    });

}

export {
    updateNpmrcWithNewPat,
    createNpmrcs,
    useNpmrc,
    deleteNpmrc,
    listNpmrcs,
}