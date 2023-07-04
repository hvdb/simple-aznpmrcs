# Simple-aznpmrcs

## Why I created this

Every 30/60/90 days the PAT was expired that was used for installing NPM dependencies.  
Which meant I needed to login, create a new PAT, covert it to base64, update NPMRC and then I was able to proceed.  

If you only have one Azure DevOps organization then it is not handy but doable.  
I use multiple and therefor needed to login to each of the different Organizations and do the update circus.  
And ofcourse, that was always when you can cannot really use it >.<  

So in comes this module!  
It can create NPMRC' based on the given `aZOrganization`, `azProject` and `feedname`  
A PAT is generate automatically and you can update it with ease.  

As this is automated, there is no need to have very long lived PAT's. You can use shortlived because well its easy to regenerate. 

## So how does it work

It uses the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) to connect.  
You need to make sure that you have this installed, and are logged in (`az login`)  

After that you are good to go :-) 

## How to use it

You can either install it globally `npm install -g simple-aznpmrcs` or use npx `npx simple-aznpmrcs` to execute the commands.  

You do need to have a 'default' npmrc in which you have the npmjs registry set.  
If you haven't, you can add this: `npm_config_registry=https://registry.npmjs.org ` before each npx command.  

### Create

For creating a NPMRC a few parameters are required: 
- azOrganization (first part of url) 
- azProject (second part of url)
- feedName (as available in Artifacts)
- Optional: name (directory name is used if not provided)

*Note: azOrganization & azProject are optional if repository url is provided in your package.json*

Example Azure DevOps url:  `https://dev.azure.com/henkvandenbrink/kitchensink`  
azOrganization = `henkvandenbrink`  
azProject = `kitchensink`  
feedName = As created.

Example:

`npx -y simple-aznpmrcs create henkvandenbrink kitchensink npm-feed`

### Use

When you have create one or more npmrcs you can easily switch:  

`npx -y simple-aznpmrcs example-npmrc`

### Update

For updating you only need to provide the name of the NPMRC that was created earlier.  

`npx -y simple-aznpmrcs update example-npmrc`


## Thanks

This module uses [npmrc](https://github.com/deoxxa/npmrc) npm module to create and switch the npmrc.  

