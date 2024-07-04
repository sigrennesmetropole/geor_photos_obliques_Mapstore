# geor_{CHANGE_NAME}_Mapstore 

`This repository is used by Rennes Métropole as template for the development of customized Mapstore2 plugins for geOrchestra.`

:fr: [Version française](https://gitlab2.si.rennes.fr/sig/ed/mapstore/sampleplugin/-/blob/develop/docs/README_FR.MD).

## I - General Information

_ Briefly describe what the plugin is for and how it is used at Rennes Métropole _

## II - Using this repository

**II.1 - Repository organization**

This repository is meant to be used with the geor_MapstoreExtension repository:

-	This repository (geor_{CHANGE_NAME}_Mapstore) contains the JS code of the plugin
-	The geor_MapstoreExtension repository contains the configurations files of the plugin (configs and translations)

The "Main" branch is used for the development of the plugin. For each release of the plugin, a new branch is created. The release note will specify the mapstore2-georchestra version for which the plugin version has been created.

The settings files for each plugin release are located in the RM/{CHANGE_NAME}_v.NumVersion branch of the geor_MapstoreExtension repository.



**II.2 - Using the repository**

II.2.1 - Setting up the repository

To deploy this repository locally, the follow the steps below:

`git clone --recursive https://github.com/sigrennesmetropole/geor_MapstoreExtension`

select the desired branch:

`git checkout RM/nomPlugin_v.VersionNum`

Where VersionNum is the desired release number. 

Then install the dependencies:

NodeJS >= 12.16.1 is needed

```
npm i
cd MapStore2
npm i
cd ../mapstore2-georchestra
npm i
npm fe:start
```
The application runs at http://localhost:8081 afterwards.

II.2.2 - Settings

Proxies are managed in ./proxyConfig.js file.

Locales are managed in ./assets/translations/data.lang-LANG.json

Build configuration for local use is managed in ./configs/localConfig.json

Configuration for production build is managed in ./assets/index.json


## II.3 - Plugin deployment and installation

Deployment and installation of custom plugins are managed in each plugin repository: geor_pluginName_Mapstore. Details of these procedures are given in the readme of these repositories.

**II.3.1 - CI/CD**

The project CI/CD uses the geor_MapstoreExtension CI/CD file which generates the steps of the continuous integration process. It is important to provide it with the correct project link in order to reach an instance of geor_MapstoreExtension with the correct branch (in our case RM/{CHANGE_NAME}_v.NumVersion) in order to retrieve the correct submodule from the geor_MapstoreExtension directory. The submodule in js/extension corresponds to the corresponding plugin's version.

The steps of the process are automatic and described in the CI files. This process can be described as follows: the plugin calls geor_MapstoreExtension, which generates a build of the plugin and deploys it in a remote repository. This repository has to be set up in the .gitlab-ci.yml of geor_MapstoreExtension ("publish" section). These steps can be modified according to the architecture of your system.

**II.3.2 - Manual Deployment**

To manually starts the build of the plugin, you need to run the following command from the root directory of the project:

`npm run ext:build`

A .zip file is created with the name of the extension in the 'dist' folder.

## III - Installing and configuring the plugin

**III.1 - Installing the plugin**

This plugin is a MapstoreExtension. To install it, simply go to the mapstore map context management interface and click on the "Add an extension to Mapstore" button in the plugin configuration interface to add the plugin using its .zip file.

_ If the plugin works with a back-end: link to the back-end repository and its installation procedure _

**III.2 - Configuring the plugin**

_ Describe here how to configure the plugin in the mapstore map context management interface _

_ If the plugin works with a back-end: link to the back-end repository and its configuration procedure _

