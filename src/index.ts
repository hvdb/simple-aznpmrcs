#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';


//@ts-ignore
const NPMRC_STORE = process.env.NPMRC_STORE || join(process.env.HOME || process.env.USERPROFILE, '.npmrcs')
//@ts-ignore
const NPMRC       = process.env.NPMRC || join(process.env.HOME || process.env.USERPROFILE, '.npmrc')


// let args = yargs.option('input', {
//     alias: 'i',
//     demand: true
// })
// .option('year', {
//     alias: 'y',
//     description: "Year number",
//     demand: true
// }).argv;
let userId = '';

function setup() {
   // We need to determine who is executing this.
   const output = execSync('whoami');
   userId = output.toString().replace(/(\r\n|\n|\r)/gm, '');
}

function createDefault() {
    const defaultNpmrcTemplate = fs.readFileSync(join(__dirname, '../assets/npmrc-default'));
    // check if default exists.
    if (!fs.existsSync(`${NPMRC_STORE}/default`)) {
        // Execute npmrc to create default file.
        execSync('node_modules/.bin/npmrc -c default', { stdio: 'inherit' });

        fs.writeFileSync(`${NPMRC_STORE}/default`, defaultNpmrcTemplate);
        const defaultNpmrOnDisk = fs.readFileSync(`${NPMRC_STORE}/default`);
        console.log('dd', defaultNpmrOnDisk.toString());
    }
}

// function createNpmrcs() {
//     // create default.
//     createDefault();

//     // load template
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


function start() {
    setup();
    createDefault();


    console.log('NPMRC', NPMRC);
}


function createNpmrcs() {

}



start();