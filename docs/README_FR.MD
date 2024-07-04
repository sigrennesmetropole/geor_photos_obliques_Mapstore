# Plugin {NOM_A_MODIFIER} pour MapStore2-geOrchestra

```Ce dépôt est à utiliser par Rennes Métropole comme modèle pour la création de plugin personnalisés Mapstore2 pour geOrchestra. Il est destiné à contenir le code js du plugin personnalisé et doit être utilisé conjointement avec le dépôt geor_MapstoreExtension qui contient les fichiers de paramétrage du plugin.

Pour la création d'un nouveau plugin, les étapes suivantes doivent être réalisées : 
-	Ce dépôt doit être copié puis renommé geor_nomPlugin_Mapstore pour débuter le développement d'un nouveau plugin personnalisé. 
-	Dans ce nouveau dépôt, la branche Main est la branche de développement du plugin. À chaque release, une branche v.numVersion doit être créée pour permettre une gestion facilitée des versions du plugin. La note de release précisera la version de geOrchestra pour laquelle la version du plugin a été créée.
-	Des branches doivent ensuite être créées dans le dépôt geor_MapstoreExtension, elles contiendront les fichiers de paramétrage du plugin :
-	Une branche RM/nomPlugin_main pour la version en cours de développement ;
-	Autant de branche RM/nomPlugin_v.NumVersion qu'il y a de release.
-	La CI/CD du plugin doit être paramétrée.
-	Ce readme et sa version ENG sont à mettre à jour pour décrire le nouveau plugin
-	Cette zone doit enfin être supprimé
```

:gb: [English Version](https://gitlab2.si.rennes.fr/sig/ed/mapstore/sampleplugin).

## I - Généralités

_ Décrire brièvement à quoi sert le plugin et comment il est utilisé à Rennes Métropole _

## II - Utilisation du présent dépôt

**II.1 - Organisation du dépôt**

Ce dépôt doit être conjointement utilisé avec le dépôt geor_MapstoreExtension :

-	Le présent dépôt (geor_{NOM_A_MODIFIER}_Mapstore) contient le code js du plugin
-	Le dépôt (geor_MapstoreExtension) contient les fichiers de paramétrage du plugin (configuration et locales)

La branche Main est la branche de développement du plugin. À chaque release, une branche est créée pour permettre une gestion facilitée des versions du plugin. La note de release précisera la version de mapstore2-georchestra pour laquelle la version du plugin a été créée.

Les fichiers de paramétrage de chaque release du plugin se situent dans la branche RM/{NOM_A_MODIFIER}_v.NumVersion du dépôt geor_MapstoreExtension.

**II.2 - Utilisation du dépôt**

II.2.1 - Mise en place du dépôt

Pour mettre en place ce dépôt il faut suivre la procédure suivante : 

`git clone --recursive https://github.com/sigrennesmetropole/geor_MapstoreExtension`

Puis il faut sélectionner la bonne branche

`git checkout RM/{NOM_A_MODIFIER}_v.VersionNum`

Où NumVersion est le numéro de release souhaité. Il faut par la suite installer les dépendances.

Il faut s'assurer d'avoir une version de NodeJS supérieure à node 12.16.1, puis suivre la procédure suivante : 

```
npm i
cd MapStore2
npm i
cd ../mapstore2-georchestra
npm i
npm fe:start
```
L'application est accessible via http://localhost:8081

II.2.2 - Configuration

La gestion des proxies se tient dans ./proxyConfig.js

La gestion des locales se tient dans ./assets/translations/data.lang-LANG.json

La gestion de la configuration en build pour l'utilisation locale se fait dans ./configs/localConfig.json

La gestion de la configuration pour le build de production 

## II.3 - Déploiement du plugin

Ce dépôt permet la création d'un fichier .zip du plugin pouvant être ajouté dans Mapstore2 pour geOrchestra. La génération de ce fichier est permise par l'utilisation de la CI/CD ou peut-être réalisée manuellement : 

II.3.1 – CI/CD

La CI/CD du projet fait appel au fichier de CI/CD de geor_MapstoreExtension qui génère les étapes du processus d'intégration continue. Il est important de lui fournir le bon lien de projet afin de bien atteindre une instance de geor_MapstoreExtension et la bonne branche (dans notre cas RM/{NOM_A_MODIFIER}_v.NumVersion) afin de récupérer le bon sous module dans le répertoire de MapstoreExtension. Le sous module dans js/extension correspond au plugin associé (RM/{NOM_A_MODIFIER}_v.NumVersion = {NOM_A_MODIFIER} version NumVersion)

Les étapes suivantes sont automatiques et inscrites dans les différentes étapes des fichiers de CI. Ce processus se décrit comme suit : le plugin appelle MapstoreExtension qui génère un build du plugin et le dépose sur un dépôt distant. Ce dépôt est à paramétrer dans le .gitlab-ci.yml de geor_MapstoreExtension section "publish". Ces étapes sont modifiables en fonction des réalités architecturales du système d'information de l'opérateur.

II.3.2 – Déploiement manuel

Pour lancer le build manuellement, il vous faut lancer la commande suivante à partir de la racine du projet :

`npm run ext:build`

Cela va créer un .zip avec le nom de l'extension dans le dossier 'dist' qui est le plugin compilé. 


### III - Installation et configuration du plugin

**III.1 – Installation du plugin **

Ce plugin est une MapstoreExtension. Il suffit pour l'installer d'accéder à l'interface d'administration de contexte de carte mapstore et dans l'interface de configuration des plugins, de cliquer sur le bouton "Ajouter une extension à Mapstore" pour ajouter le plugin à l'aide de son fichier .zip.

_ {Si back existant} Ce plugin s'appuie sur un back-end. La procédure d'installation de ce dernier est disponible dans son dépôt github {Référencer le dépôt du back} _


**III.2 – Configuration du plugin**

_ Décrire comment doit être configuré le plugin lors de son ajout dans un contexte de carte pour pouvoir fonctionner correctement _ 

_ {Si back existant} Ce plugin s'appuie sur un back-end. La procédure de configuration de ce dernier est disponible dans son dépôt github {Référencer le dépôt du back} _

