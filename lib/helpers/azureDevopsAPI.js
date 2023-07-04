"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokePat = exports.createPat = void 0;
const child_process_1 = require("child_process");
function createPat(azProject, displayName) {
    // vso.packaging
    // vso.code_write
    const response = JSON.parse((0, child_process_1.execSync)(`az rest --method post --uri "https://vssps.dev.azure.com/${azProject}/_apis/Tokens/Pats?api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --body '{ "displayName": "${displayName}", scope: "vso.packaging" }' --headers Content-Type=application/json`).toString());
    if (response.patTokenError === 'none') {
        return response.patToken;
    }
    throw Error('could not generate token');
}
exports.createPat = createPat;
// function getPat(region, authId) {
//     const response = JSON.parse(execSync(`az rest --method get --uri "https://vssps.dev.azure.com/${region}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --headers Content-Type=application/json`).toString());
// }
function revokePat(azProject, authId) {
    const response = (0, child_process_1.execSync)(`az rest --method delete --uri "https://vssps.dev.azure.com/${azProject}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/"`).toString();
}
exports.revokePat = revokePat;
