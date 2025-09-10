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
      window.game.dispInit.groupInitiative();
    },
    onUp: () => {},
    restricted: true, // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
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

Hooks.once("ready", async function () {});
