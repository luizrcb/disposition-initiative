const moduleName = "disposition-initiative";

/**
 * Return an array of unique decimals in {0.1 ... 0.9}.
 * Keeps the original behavior and defaults.
 * @param {number} count
 * @returns {number[]}
 */
function getUniqueRandomDecimals(count = 5) {
  const nums = new Set();
  while (nums.size < count) {
    const digit = Math.floor(Math.random() * 9) + 1; // 1..9
    nums.add(digit / 10); // 0.1..0.9
  }
  return Array.from(nums);
}

/**
 * Return an array of unique small decimals (0.01 to 0.09) for intra-group tie-breaking
 * @param {number} count - Number of tokens in the group
 * @returns {number[]}
 */
function getUniqueIntraGroupDecimals(count) {
  const availableDigits = [...Array(9).keys()].map((i) => i + 1);
  const shuffled = [...availableDigits].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((digit) => digit / 100);
}

/** Random pick from a non-empty array */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Ensure a token has a combatant (preserves original API usage) */
async function ensureCombatant(token) {
  if (!token.combatant) {
    await token.toggleCombatant();
  }
}

/** Safely add decimals without floating point precision issues */
function safeDecimalAdd(base, decimal1, decimal2 = 0) {
  const total =
    Math.round(base * 100) +
    Math.round(decimal1 * 100) +
    Math.round(decimal2 * 100);
  return total / 100;
}

export default class DispInit {
  async groupInitiative({ reroll = false } = {}) {
    if (!game.user.isGM) return;

    const groupTieBreakers = getUniqueRandomDecimals();
    let tokens = [];
    const combats = game.combats.filter((combat) => combat.active);

    if (combats && combats.length) {
      const combat = combats[0];
      const combatTokens = combat.combatants.map(
        (combatant) => combatant.token,
      );

      const alreadyRolled = combat.combatants.contents.every(
        (c) => c.initiative !== null,
      );

      if (alreadyRolled && !reroll) return;

      tokens = [...combatTokens];
    }

    const canvasTokens = canvas.tokens.controlled.map(
      (token) => token.document,
    );

    if (!tokens.length) {
      tokens = [...canvasTokens];
    }

    if (!tokens || !tokens.length) {
      return ui.notifications.warn("DispInit.Error.NoSelectedToken", {
        localize: true,
        permanent: true,
      });
    }

    const groups = {
      players: [],
      friendly: [],
      neutral: [],
      hostile: [],
      secret: [],
    };

    const useInitiativeTiebreaking = game.settings.get(
      moduleName,
      "initiativeTieBreak",
    );

    const groupPlayersToFriendlyTokens = game.settings.get(
      moduleName,
      "groupPlayersToFriendlyTokens",
    );

    const { FRIENDLY, NEUTRAL, HOSTILE, SECRET } = CONST.TOKEN_DISPOSITIONS;

    // Separate tokens into groups (preserving the original logic)
    for (const token of tokens) {
      if (token?.hasPlayerOwner === true) {
        if (groupPlayersToFriendlyTokens) {
          groups.friendly.push(token);
        } else {
          groups.players.push(token);
        }
      } else {
        const disp = token?.disposition;

        switch (disp) {
          case FRIENDLY:
            groups.friendly.push(token);
            break;
          case SECRET:
            groups.secret.push(token);
            break;
          case HOSTILE:
            groups.hostile.push(token);
            break;
          case NEUTRAL:
            groups.neutral.push(token);
            break;
          // no default: unhandled dispositions are ignored (same behavior)
        }
      }
    }

    // Process a token group with intra-group tie-breaking
    const processGroup = async (
      group,
      groupIndex,
      useInitiativeTiebreaking = false,
    ) => {
      if (group.length === 0) return;

      const roller = pickRandom(group);
      await ensureCombatant(roller);

      await game.combat.rollInitiative([roller.combatant.id]);

      const baseInitiative = Math.floor(roller.combatant.initiative);

      const groupTieBreaker = useInitiativeTiebreaking
        ? groupTieBreakers[groupIndex]
        : 0;

      const intraGroupTieBreakers = getUniqueIntraGroupDecimals(group.length);

      const shuffledIntraBreakers = [...intraGroupTieBreakers].sort(
        () => Math.random() - 0.5,
      );

      for (let i = 0; i < group.length; i++) {
        const token = group[i];
        await ensureCombatant(token);

        let finalInitiative = baseInitiative;
        if (useInitiativeTiebreaking) {
          const rollerTieBreaker = shuffledIntraBreakers[i];
          finalInitiative = safeDecimalAdd(
            baseInitiative,
            groupTieBreaker,
            rollerTieBreaker,
          );
        }

        await token.combatant.update({ initiative: finalInitiative });
      }
    };

    for (const [index, group] of Object.values(groups).entries()) {
      if (group.length) {
        await processGroup(group, index, useInitiativeTiebreaking);
      }
    }

    const activeCombatHasStarted = game.combats.find(
      (combat) => combat.active && combat.started,
    );
    if (activeCombatHasStarted) {
      await activeCombatHasStarted.update({
        round: activeCombatHasStarted.round,
        turn: 0,
      });
    }
  }
}
