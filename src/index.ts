#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { createPat, revokePat } from './helpers/azureDevopsAPI';

//@ts-ignore
const NPMRC_STORE = process.env.NPMRC_STORE || join(process.env.HOME || process.env.USERPROFILE, '.npmrcs')
//@ts-ignore
const NPMRC = process.env.NPMRC || join(process.env.HOME || process.env.USERPROFILE, '.npmrc')

const argv = yargs(process.argv.slice(2))
    .command(['update [npmrc]'], 'Update provided NPMRC with new credentials', {}, (argv) => {
        console.log('Updating', argv.npmrc)
        updateNpmrcWithNewPat(argv.npmrc as string);
    })
    .parseAsync();


function createDefault() {
    const defaultNpmrcTemplate = fs.readFileSync(join(__dirname, '../assets/npmrc-default'));
    // check if default exists.
    if (!fs.existsSync(`${NPMRC_STORE}/default`)) {
        // Execute npmrc to create default file.
        execSync('node_modules/.bin/npmrc -c default', { stdio: 'inherit' });
        // Write the template to the default npmrc
        fs.writeFileSync(`${NPMRC_STORE}/default`, defaultNpmrcTemplate);
    }
}

// function createNpmrcs() {

//     // Determing project name.
//     // Determine feedId.

//     // load template for azure
//     const template = fs.readFileSync(join(__dirname, '../assets/npmrc-template')).toString();
//     projects.forEach((prj) => {
//         if (!existsSync(`/Users/${userId}/.npmrcs/${prj.project}`)) {
//             // Create an npmrc with the name of the project
//             execSync(`npx npmrc -c ${prj.project}`, { stdio: 'inherit' });
//             // Now we update the template with the feed.
//             const newNpmrc = template.replaceAll('$NPM_FEED', prj.feed);
//             // Save the npmrc so that it can be used.
//             writeFileSync(`/Users/${userId}/.npmrcs/${prj.project}`, newNpmrc);
//         }
//     })
// }

function updateExistingNpmrcs() {

}


function updateNpmrcWithNewPat(npmrcName: string) {

    console.log('Name', npmrcName)

    // NPMRC file exists let's update it with a new password.
    let files = fs.readdirSync(`${NPMRC_STORE}`);

    if (!npmrcName) {
        files = [npmrcName];
    }

    files.map((file) => {

        // check if file exists, else throw warning.
        if (fs.existsSync(`${NPMRC_STORE}/${file}`)) {

            // Determine region
            const azProject = 'INGCDaaS';
            // Load the npmrc file
            let npmrc = fs.readFileSync(`${NPMRC_STORE}/${file}`).toString();

            // Check if there is an authorizationId, if so we need to revoke it first.
            const authIdIsThere = npmrc.includes('#script#');

            if (authIdIsThere) {
                console.debug('AuthorizationID was found, revoke PAT.');
                // We need to revoke and regenerate
                const authId = npmrc.substring(npmrc.indexOf('#script#') + 8, npmrc.lastIndexOf('#script#'));

                revokePat(azProject, authId)
                npmrc = npmrc.replace(`#script#${authId}#script#`, '');
            }

            // create new PAT
            const patToken = createPat(azProject, `${file}_feed`);
            const authorizationId = patToken.authorizationId;

            const base64 = Buffer.from(patToken.token.trim()).toString('base64');
            const matches = npmrc.matchAll(/:_password=.*/g);

            for (const match of matches) {
                npmrc = npmrc.replace(match[0], `:_password=${base64}`);
            }
            // We need to add the authorizationId so that we can revoke it later on.
            npmrc = npmrc + `#script#${authorizationId}#script#`;

            console.log('dd', npmrc)
            fs.writeFileSync(`${NPMRC_STORE}/${file}`, npmrc);
        } else {
            throw new Error(`The provided npmrc(${file}) does not exists. Make sure to first create it via 'create'`)
        }
    });

}




function start() {

    console.log('options', argv);

    // if (argv.pat)


    // create default.
    createDefault();
    // Create different npmrcs
    // createNpmrcs();


    console.log('NPMRC', NPMRC);
}

// start();