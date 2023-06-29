#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';

let args = yargs.option('input', {
    alias: 'i',
    demand: true
})
.option('year', {
    alias: 'y',
    description: "Year number",
    demand: true
}).argv;

let userId = '';

function setup() {
   // We need to determine who is executing this.
   const output = fs.execSync('whoami');
   userId = output.toString().replace(/(\r\n|\n|\r)/gm, '');
}


function start() {
    setup();

}


function createNpmrcs() {

}



