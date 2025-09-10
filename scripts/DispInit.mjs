export default class DispInit {
  async groupInitiative() {
    const tokens = canvas.tokens.controlled;

    const excluded = [];
    const groups = {
      group1: [], // Players and Friendly Tokens
      group2: [], // Neutral Tokens
      group3: [], // Hostile Tokens
      group4: [], // secret Tokens
    };

    if (!tokens || !tokens.length) {
      ui.notifications.warn("DispInit.Error.NoSelectedToken", {
        localize: true,
        permanent: true,
      });
    }

    // Separate tokens into groups
    for (const token of tokens) {
      const actor = token.actor;
      if (token.document.hasPlayerOwner === true) {
        groups.group1.push(token);
      } else {
        const isFriendlyToken =
          token.document.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        const isNeutralToken =
          token.document.disposition === CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        const isHostileToken =
          token.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE;
        const isSecretToken =
          token.document.disposition === CONST.TOKEN_DISPOSITIONS.SECRET;

        if (isFriendlyToken) {
          groups.group1.push(token);
        } else if (isSecretToken) {
          groups.group4.push(token);
        } else if (isHostileToken) {
          groups.group3.push(token);
        } else if (isNeutralToken) {
          groups.group2.push(token);
        }
      }
    }

    // Process a token group
    async function processGroup(group) {
      if (group.length === 0) return;

      // Select random roller
      const roller = group[Math.floor(Math.random() * group.length)];

      // Ensure roller is in combat
      if (!roller.combatant) {
        await roller.document.toggleCombatant();
      }

      // Roll initiative for roller
      await game.combat.rollAll({
        messageOptions: { rollMode: CONST.DICE_ROLL_MODES.PUBLIC },
      });

      const initVal = roller.combatant.initiative;

      // Apply initiative to group
      for (const token of group) {
        if (token === roller) continue;

        if (!token.combatant) {
          await token.document.toggleCombatant();
        }

        await token.combatant.update({ initiative: initVal });
      }
    }

    for (let group of Object.values(groups)) {
      if (group.length) {
        await processGroup(group);
      }
    }
  }
}
