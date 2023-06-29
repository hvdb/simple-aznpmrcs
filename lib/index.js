#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const child_process_1 = require("child_process");
const path_1 = require("path");
//@ts-ignore
const NPMRC_STORE = process.env.NPMRC_STORE || (0, path_1.join)(process.env.HOME || process.env.USERPROFILE, '.npmrcs');
//@ts-ignore
const NPMRC = process.env.NPMRC || (0, path_1.join)(process.env.HOME || process.env.USERPROFILE, '.npmrc');
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
    const output = (0, child_process_1.execSync)('whoami');
    userId = output.toString().replace(/(\r\n|\n|\r)/gm, '');
}
function createDefault() {
    const defaultNpmrcTemplate = fs.readFileSync((0, path_1.join)(__dirname, '../assets/npmrc-default'));
    // check if default exists.
    if (!fs.existsSync(`${NPMRC_STORE}/default`)) {
        // Execute npmrc to create default file.
        (0, child_process_1.execSync)('node_modules/.bin/npmrc -c default', { stdio: 'inherit' });
        fs.writeFileSync(`${NPMRC_STORE}/default`, defaultNpmrcTemplate);
        const defaultNpmrOnDisk = fs.readFileSync(`${NPMRC_STORE}/default`);
        console.log('dd', defaultNpmrOnDisk.toString());
    }
}
function start() {
    setup();
    createDefault();
    console.log('NPMRC', NPMRC);
}
function createNpmrcs() {
}
start();
