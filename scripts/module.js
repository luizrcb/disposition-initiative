const moduleName = "disposition-initiative";

import DispInit from "./DispInit.mjs";

Hooks.once("init", async function () {
  // Load API
  let dispInit = new DispInit();
  window.game.dispInit = dispInit;

  // --------------------------------------------------
  // KEYBINDINGS
  game.keybindings.register(moduleName, "disposition-initiative_keybinding", {
    name: "Disposition Initiative",
    hint: "This will trigger the Disposition Initiative.",
    editable: [{ key: "KeyG", modifiers: [] }],
    onDown: () => {
      const activeCombatHasStarted = game.combats.find(
        (combat) => combat.active && combat.started
      );
      if (!activeCombatHasStarted) {
        window.game.dispInit.groupInitiative();
      }
    },
    onUp: () => {},
    restricted: true, // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.settings.register(moduleName, "initiativeTieBreak", {
    name: "DispInit.Settings.InitiativeTiebreak",
    hint: "DispInit.Settings.InitiativeTiebreakHint",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(moduleName, "groupPlayersToFriendlyTokens", {
    name: "DispInit.Settings.GroupPlayersToFriendlyTokens",
    hint: "DispInit.Settings.GroupPlayersToFriendlyTokensHint",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(moduleName, "rerollInitiativeEveryRound", {
    name: "DispInit.Settings.RerollInitiativeEveryRound",
    hint: "DispInit.Settings.RerollInitiativeEveryRoundHint",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: false,
  });
});

Hooks.on("getSceneControlButtons", function (controls) {
  if (game.user.isGM) {
    controls.tokens.tools["disposition-initiative_button"] = {
      icon: "fa-solid fa-people-group",
      name: "disposition-initiative_button",
      title: "DispInit.Button.Title",
      button: true,
      onChange: (event, active) => {
        if (active) window.game.dispInit.groupInitiative();
      },
    };
  }
});

Hooks.on("updateCombat", async (combat, update) => {
  if (update && update.round) {
    const reroll = game.settings.get(moduleName, "rerollInitiativeEveryRound");
    if (reroll) window.game.dispInit.groupInitiative();
  }
});

Hooks.once("ready", async function () {});
