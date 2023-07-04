#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const npmrc_1 = require("./helpers/npmrc");
const argv = yargs(process.argv.slice(2))
    //@ts-ignore
    .usage(`When you are using different Azure DevOps feeds it can be a challenge to get the right NPMRC. \n
    Not anymore! You can create and use the NPMRC with ease. \n
    It will create a PAT and/or revoke and regenerate if you need to. (For instance if it is expired)\n
    No more manual work of creating a PAT, copy, create base64 and update your npmrc. \n
    Chose one of the commands that you need.`)
    .command(['update [npmrc]'], 'Update provided NPMRC with new credentials, or all when no npmrc was provided.', {}, (argv) => {
    (0, npmrc_1.updateNpmrcWithNewPat)(argv.npmrc);
})
    .command(['create [feed] [azOrganization] [azProject] [name]'], 'Create NPMRC with az and feed details. Name is optional, default is directory name.', {}, (argv) => {
    (0, npmrc_1.createNpmrcs)(argv.feed, argv.azProject, argv.azOrganization, argv.name);
})
    .command(['[npmrc]'], 'Activate provided NPMRC', {}, (argv) => {
    (0, npmrc_1.useNpmrc)(argv.npmrc);
})
    .help()
    .parseAsync();
