#!/usr/bin/env node
import * as yargs from 'yargs';
import select, { Separator } from '@inquirer/select';
import { createNpmrcs, deleteNpmrc, listNpmrcs, updateNpmrcWithNewPat, useNpmrc } from './helpers/npmrc';
import { readdirSync } from 'fs';
import { NPMRC_STORE } from './helpers/npmrcs/init';


const selectNPMRC = async () => {


    const files = readdirSync(`${NPMRC_STORE}`);
    let choices: { name: string; value: string; description: string; }[] = [];
    files.forEach((file) => {
        if (!file.startsWith('.')) {
            choices.push({
                name: file,
                value: file,
                description: `NPMRC for ${file}`
            })
        }
    });

    const answer = await select({
        message: 'Select the NPMRC that you want to activate',
        choices,
    });

    try {
        console.log('ddd', answer)
        useNpmrc(answer);
    } catch (exception) {
        console.log('d', exception)
        console.log('Execution failed, please have a look at the error messages and help.');
    }
};


const argv = yargs(process.argv.slice(2))
    //@ts-ignore
    .usage(`When you are using different Azure DevOps feeds it can be a challenge to get the right NPMRC. \n
    Not anymore! You can create and use the NPMRC with ease. \n
    It will create a PAT and/or revoke and regenerate if you need to. (For instance if it is expired)\n
    No more manual work of creating a PAT, copy, create base64 and update your npmrc. \n
    Chose one of the commands that you need.`)
    .command(['update all'], 'Update all available NPMRC', {}, (argv) => {
        try {
            updateNpmrcWithNewPat(undefined, true);
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }
    })
    .command(['update [npmrc]'], 'Update provided NPMRC with new credentials, when no parameter is provided current active one will be updated.', {}, (argv) => {
        try {
            updateNpmrcWithNewPat(argv.npmrc as string);
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }
    })
    .command(['create [feed] [azOrganization] [azProject] [name]'], `Create NPMRC with az and feed details. \n if azOrganization or azProject is not provided, repository url in package.json will be used to determine them. \n Name is optional, default is directory name.`, {}, (argv) => {
        try {
            createNpmrcs(argv.feed as string, argv.azProject as string, argv.azOrganization as string, argv.name as string);
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }

    })
    .command(['delete [npmrc]'], 'Delete provided NPMRC', {}, (argv) => {
        try {
            deleteNpmrc(argv.npmrc as string);
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }
    })
    .command(['list'], 'List all available NPMRC', {}, (argv) => {
        try {
            listNpmrcs();
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }
    })
    .command(['$0 [npmrc]'], 'Activate provided NPMRC', {}, (argv) => {
        try {
            useNpmrc(argv.npmrc as string);
        } catch (exception) {
            console.log('Execution failed, please have a look at the error messages and help.');
        }
    })
    .command('use', 'Select an NPMRC to be used', () => { }, selectNPMRC)
    .help()
    .argv;






