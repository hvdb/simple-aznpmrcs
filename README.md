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
If you haven't, you can add this: `--registry="https://registry.npmjs.org"` after each npx command.  

*note: It currently only works if your feed is 'project scoped' organization scoped will fail.*

### Create

This will create a NPMRC with the provided feed as registry **AND** create a PAT so that you can directly use it.  

#### Easiest

Only one parameter is required
- feedName (the name of the Artifact feed as created in Azure DevOps)

Then there are a few defaults:
- name of the NPMRC (defaults to the directory name)

Next to the name of the NPMRC and the feedname we also need the details of the Azure DevOps `Organization` and `Project`.  
These two values can be retrieved from the `repository.url` if that is set in the `package.json`

- azOrganization (first part of Azure DevOps url) 
- azProject (second part of Azure DevOps url)

Example Azure DevOps url:  `https://dev.azure.com/henkvandenbrink/kitchensink`  
azOrganization = `henkvandenbrink`  
azProject = `kitchensink`  
feedName = As specified

Full example:

`snmprc create feed-name`

*This will generate an NPMRC with the specified feed-name as registry, the azure details are retrieved from package.json and current directory name is used as name.*  

##### More details options

When you are not able to use the defaults or you just want to have more control, you can specify all the parameters as well.  

`snpmrc create feed-name henkvandenbrink kitchensink directory-name`

*This will generate an NPMRC with the specified feed-name as registry, the azure details that are provided and directory-name is used as name.*  

### Switch

But the real power is in the fact that you can have multiple different NPMRC' and switch between them.  
When you have used the defaults you can use:
`snpmrc`  
This will switch to the NPMRC which has the same name as the current directory. (default)

You can also switch to a specific one by providing the name of the npmrc as parameter.
`snpmrc example-npmrc-name`


### Use or list

When issuing the `use` command a list of all available NPMRC' are shown and you can select one.  
`snpmrc use`

Will show an interactive list, you can select the one that you want to activate.  

#### List

`snpmrc list` will show all available NPMRC'.

### Delete

You can also delete a NPMRC by using the delete option.  

`snpmrc delete npmrc-name`  

*This will delete the specified npmrc*

### Update used credentials (PAT)

When you are using feeds from Azure DevOps, you need to authenticate.  
You can do that via Azure DevOps, copy the credentials create a base64 paste it and well done.  
But, this process can also be automated!  

Make sure you have a valid Microsoft token, when your laptop is using the Azure AD this is usually the case.  
If not, you need to use the `AZ` commandline tool to login.  
See: [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/). 

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

How this works:

It uses the credentials from the loggedin user to authenticate with Azure DevOps and create a PAT specific for using Artifact feeds.  
While it will also revoke the current one.  

