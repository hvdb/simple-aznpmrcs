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

You can either install it globally `npm install -g simple-aznpmrcs` or use npx `npx -y simple-aznpmrcs` to execute the commands.  
In the documentation it is expected that you have it installed globally.  
If you don't want to install it globally, you need to put `npx -y` in front of each command.  

You do need to have a 'default' npmrc in which you have the npmjs registry set.  
If you haven't, you can add this: `npm_config_registry=https://registry.npmjs.org ` before each npx command.  

*note: It currently only works if your feed is 'project scoped' organization scoped will fail.*

### Create

For creating a NPMRC one parameter is required: 
- feedName (as available in Artifacts)

One that have a default:
- name (directory name is used if not provided)

And two that are needed but can be retrieved from a different property.
When `repository.url` is set in the package.json, that one will be used.  
- azOrganization (first part of Azure DevOps url) 
- azProject (second part of Azure DevOps url)

Example Azure DevOps url:  `https://dev.azure.com/henkvandenbrink/kitchensink`  
azOrganization = `henkvandenbrink`  
azProject = `kitchensink`  
feedName = As created.

Examples:

Easiest:
`snmprc create feed-name`
- This will generate an NPMRC with feed-name, the azure details are retrieved from package.json and current directory name is used as name.  

More detailed:
`snpmrc create npm-feed henkvandenbrink kitchensink myNpmrc`
- Here all options are provided and will be used.

### Switch

When you have create one or more npmrcs you can easily switch: 

`snpmrc example-npmrc`

Or if you created the NPMRC with the name of the directory:  
`snpmrc`  

### Use

When issuing the `use` command a list of all available NPMRC' are shown and you can select one.  

`snpmrc use`

### Update

There are three options for updating:

- All
- Provide a name
- Current active npmrc


Update all npmrcs:  
`snpmrc update all`  

Update provided NPMRC:  
`snpmrc myNpmrcs`

Update current NPMRC:  
`snpmrc`

