<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/luizrcb/disposition-initiative/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2F<your-module-name>&colorB=4aa94a) -->

# FoundryVTT Disposition Initiative

![](https://img.shields.io/badge/Foundry-v13-informational) ![GitHub downloads](https://img.shields.io/github/downloads/luizrcb/disposition-initiative/total?label=Downloads) ![GitHub downloads Latest](https://img.shields.io/github/downloads/luizrcb/disposition-initiative/latest/total?label=Downloads%20Latest%20Release) [![Report Bugs](https://img.shields.io/badge/Report%20Bugs%20on%20GitHub-2dba4e?logo=GitHub&amp;logoColor=white)](https://github.com/luizrcb/disposition-initiative/issues)

## Overview

Disposition Initiative is a Foundry VTT module that simplifies initiative rolls by letting one token roll for an entire side. Instead of every token rolling separately, the module randomly selects a representative from each disposition group — friendly, neutral, secret, or hostile — and uses that single roll for the whole group.

This keeps combat moving quickly, especially in larger encounters, while still keeping things fair and dynamic.

## Features

- Automatically groups tokens by their disposition (friendly, neutral, secret, and hostile).  
- Randomly selects a token from each group to roll initiative.  
- Applies the result to all tokens in that group.  
- Module setting to reroll group initiatives at the start of each new round.  
- Module setting to choose whether players are grouped with friendly tokens.  
- Lightweight and easy to use — no extra setup required.  

## How To

1. Select all tokens you want to roll initiative for. You don’t need to create the encounter beforehand.  
   - If the encounter is already created and tokens have been added to the combat tracker, you don’t need to select them on the scene canvas.  
2. Click the **Disposition Initiative** button in the Token Controls menu (or press the `G` shortcut key — note that this shortcut won’t work once the active encounter has already started).  

## Changelog

You can see changes at [CHANGELOG](CHANGELOG.md).

## Instalation

You can use one of the following installation methods:

1. Pasting the following url into the **Install Module** dialog on the Setup menu of the application.
##
    https://github.com/luizrcb/disposition-initiative/releases/latest/download/module.json
2. Browsing the repository's [Releases](https://github.com/luizrcb/disposition-initiative/releases) page, where you can copy any module.json link for use in the Install Module dialog.
3. Downloading one of the .zip archives from the Releases page and extracting it into your foundry Data folder, under `Data/modules/disposition-initiative`.

## Community

- Do you have something to improve this module? [Share it!](https://github.com/luizrcb/disposition-initiative/issues)
- Do you find out a bug? [Report it!](https://github.com/luizrcb/disposition-initiative/issues)

## Licenses

- **Source Code:** All source code files (javascript, css) are licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).
- **Foundry VTT:** The project is created following the Foundry VTT [Limited License Agreement for module development](https://foundryvtt.com/article/license/).
