let ComplexityUpgrades = {
  complexityUpgradeRequirements: [
    [
      () => ComplexityChallenge.getComplexityChallengeCompletions(2) >= 8,
      situation => situation === 'eternity',
      situation => situation === 'chroma',
      () => Studies.list.filter(x => x.isBought()).length >= 11
    ],
    [
      () => Boost.multiplierPer() >= Math.pow(2, 24) && !InfinityChallenge.isInfinityChallengeRunning(7),
      () => Eternities.amount().gte(Math.pow(2, 24)),
      situation => situation === 'chroma',
      () => Studies.totalTheorems() >= 231
    ],
    [
      () => Boost.bought() >= 1024 && EternityChallenge.isEternityChallengeRunning(2),
      () => EternityChallenge.getTotalEternityChallengeCompletions() >= 32 && !EternityChallenge.usedAutoECCompletionThisComplexity(),
      () => ComplexityChallenge.getComplexityChallengeCompletions(4) >= 13,
      () => Generators.list.some(x => x.multiplier().gte(Decimal.pow(Generators.nerfValue(), 3)))
    ],
    [
      () => Boost.boostPower() >= Math.pow(2, 18),
      () => EternityChallenge.getTotalEternityChallengeCompletions() >= 20 && !EternityChallenge.usedAutoECCompletionThisComplexity(),
      situation => situation === 'chroma',
      () => Studies.totalTheorems() >= 168
    ]
  ],
  complexityUpgradeEffects: [
    [
      () => Complexities.permanenceAndChromaMultiplier(),
      () => Math.pow(Math.min(16, player.complexities), 2),
      () => null,
      () => Math.pow(Math.max(1, Math.log2(Boost.multiplierPer())), 0.5)
    ],
    [
      () => 1 + Math.max(0, player.eternities.log(2) / 64),
      () => null,
      () => 1 + Math.max(0, player.eternities.log(2) / 16),
      () => 3
    ],
    [
      () => 1 + Math.log2(1 + Chroma.colorAmount(1) / Math.pow(2, 20)),
      () => null,
      () => null,
      () => null
    ],
    [
      () => Math.max(Math.pow(2, 1 / 8), Math.pow(Math.max(0, Math.log2(Boost.bestBoostPower())), 1 / 4)),
      () => null,
      () => 1 + Studies.totalTheorems() / 1024,
      () => Decimal.pow(2, 1024)
    ]
  ],
  complexityUpgradeDefaults: [
    [1, 0, null, 1],
    [1, null, 1, 1],
    [1, null, null, null],
    [Math.pow(2, 1 / 8), null, 1, new Decimal(0)]
  ],
  checkForComplexityUpgrades(situation) {
    for (let row = 1; row <= 4; row++) {
      if (ComplexityChallenge.isComplexityChallengeRunning([2, 3, 4, 6][row - 1])) {
        for (let column = 1; column <= 4; column++) {
          if (!this.hasComplexityUpgrade(row, column) &&
            this.canUnlockComplexityUpgrade(row, column, situation)) {
            this.unlockComplexityUpgrade(row, column);
          }
        }
      }
    }
  },
  canUnlockComplexityUpgrade(row, column, situation) {
    // This doesn't check being in the challenge so make sure to check that first.
    // It also doesn't check whether the player already has the complexity upgrade.
    return this.complexityUpgradeRequirements[row - 1][column - 1](situation);
  },
  unlockComplexityUpgrade(row, column) {
    player.complexityUpgrades[row - 1][column - 1] = true;
    if (row === 1 && column === 2) {
      // Give the starting eternities, belatedly, as if the player had started with them.
      Eternities.add(this.effect(1, 2));
    }
    if (row === 4 && column === 2) {
      player.eternityChallengeCompletions = [4, 4, 4, 4, 4, 4, 4, 4];
    }
    if (row == 4 && column === 4) {
      EternityPoints.add(this.effect(4, 4));
      Studies.updateExtraTheorems();
    }
  },
  hasComplexityUpgrade(row, column) {
    return player.complexityUpgrades[row - 1][column - 1];
  },
  complexityUpgradeStatusDescription(row, column) {
    if (this.hasComplexityUpgrade(row, column)) {
      return 'Active';
    } else {
      return 'Locked';
    }
  },
  rawEffect(row, column) {
    return this.complexityUpgradeEffects[row - 1][column - 1]();
  },
  effect(row, column) {
    if (this.hasComplexityUpgrade(row, column)) {
      return this.rawEffect(row, column);
    }
    return this.complexityUpgradeDefaults[row - 1][column - 1];
  }
}
