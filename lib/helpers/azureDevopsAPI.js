"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokePat = exports.createPat = void 0;
const child_process_1 = require("child_process");
function createPat(azOrganization, displayName) {
    console.log('Creating PAT.');
    // vso.packaging
    // vso.code_write
    const response = JSON.parse((0, child_process_1.execSync)(`az rest --method post --uri "https://vssps.dev.azure.com/${azOrganization}/_apis/Tokens/Pats?api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --body '{ "displayName": "${displayName}", scope: "vso.packaging" }' --headers Content-Type=application/json`).toString());
    if (response.patTokenError === 'none') {
        console.log('PAT is created.');
        return response.patToken;
    }
    throw Error('Could not generate token', response.patTokenError);
}
exports.createPat = createPat;
// function getPat(region, authId) {
//     const response = JSON.parse(execSync(`az rest --method get --uri "https://vssps.dev.azure.com/${region}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --headers Content-Type=application/json`).toString());
// }
function revokePat(azOrganization, authId) {
    console.log('Revoking PAT');
    const response = (0, child_process_1.execSync)(`az rest --method delete --uri "https://vssps.dev.azure.com/${azOrganization}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/"`).toString();
}
exports.revokePat = revokePat;
