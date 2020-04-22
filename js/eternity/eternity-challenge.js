let EternityChallenge = {
  goals: [Infinity,
    Decimal.pow(2, 512), Decimal.pow(2, 8192), Decimal.pow(2, 1024),
    Decimal.pow(2, 1.375 * Math.pow(2, 14)), Decimal.pow(2, Math.pow(2, 32)),
    Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)),
  ],
  requirements: [Infinity,
    Decimal.pow(2, 1.75 * Math.pow(2, 21)), 1024, Decimal.pow(2, 1.375 * Math.pow(2, 18)),
    Decimal.pow(2, 1.375 * Math.pow(2, 14)), Decimal.pow(2, Math.pow(2, 32)), 12,
    Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)),
  ],
  goalIncreases: [Infinity,
    Decimal.pow(2, 1024), Decimal.pow(2, 3072), Decimal.pow(2, 512),
    Decimal.pow(2, 8192), Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)),
    Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)),
  ],
  requirementIncreases: [Infinity,
    Decimal.pow(2, 1.5 * Math.pow(2, 20)), 512, Decimal.pow(2, 1.25 * Math.pow(2, 17)),
    Decimal.pow(2, 1.5 * Math.pow(2, 13)), Decimal.pow(2, Math.pow(2, 32)), 4,
    Decimal.pow(2, Math.pow(2, 32)), Decimal.pow(2, Math.pow(2, 32)),
  ],
  rewards: [
    null,
    x => Decimal.pow(2, x * Math.pow(Stars.amount().max(1).log2(), 0.5) / 4),
    x => 1 - x / 16,
    x => 1 + x / 256,
    x => Decimal.pow(2, x * Math.pow(InfinityPoints.amount().max(1).log2(), 0.5) / 2),
    x => 1 + x / 64,
    x => 1 + x / 8,
    x => EternityPoints.amount().max(1).pow(x / 4),
    x => Decimal.pow(16, x),
  ],
  resourceAmounts: [
    () => null,
    () => Stars.amount(),
    () => Boost.bought(),
    () => Prestige.prestigePower(),
    () => InfinityPoints.amount(),
    () => InfinityStars.amount(),
    () => EternityChallenge.getTotalEternityChallengeCompletions(),
    () => EternityPoints.amount(),
    () => EternityStars.amount(),
  ],
  resourceNames: [
    null, 'stars', 'boosts', 'prestige power', 'infinity points',
    'infinity stars', 'total EC completions',
    'eternity points', 'eternity stars',
  ],
  costs: [Infinity, 5, 6, 8, 10, 12, 15, 20, 24],
  pressEternityChallengeButton(x) {
    if (this.isEternityChallengeRunning(x)) {
      this.exitEternityChallenge();
    } else if (this.canEternityChallengeBeStarted(x)) {
      this.startEternityChallenge(x);
    } else if (this.canEternityChallengeBeUnlocked(x)) {
      this.unlockEternityChallenge(x);
    }
  },
  eternityChallengeButtonText(x) {
    if (this.isEternityChallengeRunning(x)) {
      return 'Exit challenge';
    } else if (this.canEternityChallengeBeStarted(x)) {
      return 'Start challenge';
    } else if (this.canEternityChallengeBeUnlocked(x)) {
      return 'Unlock challenge';
    } else if (this.getUnlockedEternityChallenge() !== 0) {
      return 'Another EC already unlocked';
    } else if (Decimal.lt(this.getEternityChallengeResourceAmount(x), this.getEternityChallengeRequirement(x))) {
      return 'Requires more ' + this.getEternityChallengeResourceName(x);
    } else if (player.unspentTheorems < this.getEternityChallengeCost(x)) {
      return 'Requires more unspent theorems';
    }
  },
  currentEternityChallenge() {
    return player.currentEternityChallenge;
  },
  getEternityChallengeGoal(x) {
    return this.goals[x].times(Decimal.pow(this.goalIncreases[x], this.getEternityChallengeCompletions(x)));
  },
  getEternityChallengeRequirement(x) {
    let initialRequirement = this.requirements[x];
    if (Decimal.gt(initialRequirement, 1e10)) {
      return initialRequirement.times(Decimal.pow(this.requirementIncreases[x], this.getEternityChallengeCompletions(x)));
    } else {
      return initialRequirement + this.requirementIncreases[x] * this.getEternityChallengeCompletions(x);
    }
  },
  getEternityChallengeReward(x) {
    return this.rewards[x](this.getRewardCalculationEternityChallengeCompletions(x));
  },
  getEternityChallengeNextReward(x) {
    return this.rewards[x](this.getNextRewardCalculationEternityChallengeCompletions(x));
  },
  getEternityChallengeCost(x) {
    return this.costs[x];
  },
  getUnlockedEternityChallenge() {
    return player.unlockedEternityChallenge;
  },
  getUnlockedEternityChallengeCost() {
    let challenge = this.getUnlockedEternityChallenge();
    return (challenge > 0) ? this.getEternityChallengeCost(challenge) : 0;
  },
  getEternityChallengeCompletions(x) {
    return player.eternityChallengeCompletions[x - 1];
  },
  isEternityChallengeCompleted(x) {
    return this.getEternityChallengeCompletions(x) >= 4;
  },
  getRewardCalculationEternityChallengeCompletions(x) {
    if (EternityChallenge.isEternityChallengeRunning(6)) {
      return 0;
    }
    return this.getEternityChallengeCompletions(x) *
      (x === 6 ? 1 : EternityChallenge.getEternityChallengeReward(6));
  },
  getNextRewardCalculationEternityChallengeCompletions(x) {
    if (EternityChallenge.isEternityChallengeRunning(6)) {
      return 0;
    }
    return (1 + this.getEternityChallengeCompletions(x)) *
      (x === 6 ? 1 : EternityChallenge.getEternityChallengeReward(6));
  },
  getTotalEternityChallengeCompletions() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(x => this.getEternityChallengeCompletions(x)).reduce((a, b) => a + b);
  },
  extraTheorems() {
    return this.getTotalEternityChallengeCompletions();
  },
  getEternityChallengeResourceAmount(x) {
    return this.resourceAmounts[x]();
  },
  getEternityChallengeResourceName(x) {
    return this.resourceNames[x];
  },
  canEternityChallengeBeStarted(x) {
    return this.getUnlockedEternityChallenge() === x;
  },
  isEternityChallengeRunning(x) {
    return this.currentEternityChallenge() === x;
  },
  isSomeEternityChallengeRunning(x) {
    return this.currentEternityChallenge() !== 0;
  },
  isNoEternityChallengeRunning() {
    return this.currentEternityChallenge() === 0;
  },
  eternityChallengeRequirementDescription(x) {
    // This could be done as easily in the HTML but it seems nice to have a method
    return format(this.getEternityChallengeResourceAmount(x)) + '/' + format(this.getEternityChallengeRequirement(x)) +
      ' ' + this.getEternityChallengeResourceName(x);
  },
  eternityChallengeStatusDescription(x) {
    if (this.isEternityChallengeCompleted(x)) {
      if (this.isEternityChallengeRunning(x)) {
        return 'Completed, running';
      } else {
        return 'Completed';
      }
    } else {
      if (this.isEternityChallengeRunning(x)) {
        return 'Running';
      } else {
        return '';
      }
    }
  },
  eternityChallengeCompletionsDescription(x) {
    // This could be done as easily in the HTML but it seems nice to have a method (also applies to some things below)
    return 'Completed ' + format(this.getEternityChallengeCompletions(x)) + '/' + format(4) + ' times';
  },
  setEternityChallenge(x) {
    player.currentEternityChallenge = x;
  },
  canEternityChallengeBeUnlocked(x) {
    return this.getUnlockedEternityChallenge() === 0 &&
      Decimal.gte(this.getEternityChallengeResourceAmount(x), this.getEternityChallengeRequirement(x)) &&
      player.unspentTheorems >= this.getEternityChallengeCost(x);
  },
  unlockEternityChallenge(x) {
    // This function should only be called if the eternity challenge
    // has previously been confirmed to be unlockable.
    player.unspentTheorems -= this.getEternityChallengeCost(x);
    player.unlockedEternityChallenge = x;
  },
  isRespecOn() {
    return player.respecEternityChallenge;
  },
  toggleRespec() {
    player.respecEternityChallenge = !player.respecEternityChallenge;
  },
  respec() {
    this.lockUnlockedEternityChallenge();
  },
  maybeRespec() {
    if (this.isRespecOn()) {
      this.respec();
    }
    player.respecEternityChallenge = false;
  },
  lockUnlockedEternityChallenge() {
    player.unspentTheorems += this.getUnlockedEternityChallengeCost();
    player.unlockedEternityChallenge = 0;
  },
  startEternityChallenge(x) {
    this.setEternityChallenge(x);
    EternityPrestigeLayer.eternityReset();
  },
  exitEternityChallenge() {
    this.setEternityChallenge(0);
    EternityPrestigeLayer.eternityReset();
  },
  checkForEternityChallengeCompletion() {
    let cc = this.currentEternityChallenge();
    if (cc !== 0) {
      this.completeEternityChallenge(cc);
    }
  },
  completeEternityChallenge(x) {
    if (player.eternityChallengeCompletions[x - 1] < 4) {
      player.eternityChallengeCompletions[x - 1]++;
      player.unspentTheorems++;
    }
    this.setEternityChallenge(0);
    this.lockUnlockedEternityChallenge();
  },
  eternityChallenge1InfinityStarsEffect() {
    return 1 - 1 / (1 + player.infinityStars.max(1).log2() / 2048);
  },
  eternityChallenge1EternityStarsEffect() {
    return 1 - 1 / (1 + player.eternityStars.max(1).log2() / 256);
  },
  eternityChallenge4AllowedInfinities() {
    return Math.max(0, 12 - 4 * this.getEternityChallengeCompletions(4));
  },
  eternityChallenge4DoneInfinities() {
    return Infinities.realAmount();
  },
  eternityChallenge4RemainingInfinities() {
    return this.eternityChallenge4AllowedInfinities() - Infinities.realAmount();
  },
  isThereEternityChallengeText() {
    return [1, 4].indexOf(this.currentEternityChallenge()) !== -1;
  },
  eternityChallengeText() {
    let cc = this.currentEternityChallenge();
    if (cc === 1) {
      return 'Eternity Challenge 1 exponents: ' +
        formatWithPrecision(this.eternityChallenge1InfinityStarsEffect(), 5) + ' to normal generators, ' +
        formatWithPrecision(this.eternityChallenge1EternityStarsEffect(), 5) + ' to infinity generators';
    } else if (cc === 4) {
      return 'Eternity Challenge 4: ' + format(this.eternityChallenge4DoneInfinities()) + '/' +
        format(this.eternityChallenge4AllowedInfinities()) + ' infinities done';
    } else {
      return 'This text should never appear.';
    }
  }
}
