#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
let args = yargs.option('input', {
    alias: 'i',
    demand: true
})
    .option('year', {
    alias: 'y',
    description: "Year number",
    demand: true
}).argv;
console.log(JSON.stringify(args));
