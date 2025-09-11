const moduleName = "disposition-initiative";

function getUniqueRandomDecimals(count = 5) {
  const nums = new Set();

  while (nums.size < count) {
    const digit = Math.floor(Math.random() * 9) + 1;
    nums.add(digit / 10);
  }

  return Array.from(nums);
}

export default class DispInit {
  async groupInitiative() {
    const tieBreakers = getUniqueRandomDecimals();

    const tokens = canvas.tokens.controlled;

    const groups = {
      players: [],
      friendly: [],
      neutral: [],
      hostile: [],
      secret: [],
    };

    if (!tokens || !tokens.length) {
      ui.notifications.warn("DispInit.Error.NoSelectedToken", {
        localize: true,
        permanent: true,
      });
    }

    const initiativeTieBreak = game.settings.get(
      moduleName,
      "initiativeTieBreak"
    );
    const groupPlayersToFriendlyTokens = game.settings.get(
      moduleName,
      "groupPlayersToFriendlyTokens"
    );

    // Separate tokens into groups
    for (const token of tokens) {
      if (token.document.hasPlayerOwner === true) {
        if (groupPlayersToFriendlyTokens) {
          groups.friendly.push(token);
        } else {
          groups.players.push(token);
        }
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
          groups.friendly.push(token);
        } else if (isSecretToken) {
          groups.secret.push(token);
        } else if (isHostileToken) {
          groups.hostile.push(token);
        } else if (isNeutralToken) {
          groups.neutral.push(token);
        }
      }
    }

    // Process a token group
    async function processGroup(group, index) {
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

      let initVal = roller.combatant.initiative;

      if (initiativeTieBreak) {
        initVal += tieBreakers[index];
        await roller.combatant.update({ initiative: initVal });
      }

      // Apply initiative to group
      for (const token of group) {
        if (token === roller) continue;

        if (!token.combatant) {
          await token.document.toggleCombatant();
        }

        await token.combatant.update({ initiative: initVal });
      }
    }

    for (const [index, group] of Object.values(groups).entries()) {
      if (group.length) {
        await processGroup(group, index);
      }
    }
  }
}
