import { execSync } from 'child_process';

function createPat(azOrganization: string, displayName: string) {
    console.log('Creating PAT.');
    // vso.packaging
    // vso.code_write
    const response = JSON.parse(execSync(`az rest --method post --uri "https://vssps.dev.azure.com/${azOrganization}/_apis/Tokens/Pats?api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --body '{ "displayName": "${displayName}", scope: "vso.packaging" }' --headers Content-Type=application/json`).toString());
    if (response.patTokenError === 'none') {
        console.log('PAT is created.');
        return response.patToken;
    }
    throw Error('Could not generate token', response.patTokenError);
}

// function getPat(region, authId) {
//     const response = JSON.parse(execSync(`az rest --method get --uri "https://vssps.dev.azure.com/${region}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/" --headers Content-Type=application/json`).toString());
// }

function revokePat(azOrganization: string, authId: string) {
    console.log('Revoking PAT');
    const response = execSync(`az rest --method delete --uri "https://vssps.dev.azure.com/${azOrganization}/_apis/Tokens/Pats?authorizationId=${authId}&api-version=7.01-preview.1" --resource "https://management.core.windows.net/"`).toString();
}


export {
    createPat,
    revokePat,
}