let FinalityPrestigeLayer = {
  complexityPointRequirementForFinality() {
    return Decimal.pow(2, Math.pow(2, 16));
  },
  canFinality() {
    return ComplexityPoints.totalCPProducedThisFinality().gte(this.complexityPointRequirementForFinality());
  },
  isRequirementVisible() {
    return !this.canFinality() && PrestigeLayerProgress.hasReached('complexity');
  },
  isAmountSpanVisible() {
    return this.isRequirementVisible() && PrestigeLayerProgress.hasReached('finality');
  },
  resetText() {
    if (this.canFinality()) {
      return 'finality';
    } else {
      return 'do a finality reset (no finality point gain or complexity gain)';
    }
  },
  finalityPointGain() {
    return FinalityShardUpgrade(2).effect();
  },
  finalityPoints() {
    return FinalityPoints.amount();
  },
  newFinalityPoints() {
    return this.finalityPoints().plus(this.finalityPointGain());
  },
  totalFinalityPoints() {
    return FinalityPoints.totalFPProduced();
  },
  finalityPointGainRatio() {
    return this.finalityPointGain().div(this.totalFinalityPoints());
  },
  finalityPointGainRatioText() {
    if (this.totalFinalityPoints().neq(0)) {
      return format(this.finalityPointGainRatio()) + 'x total, ';
    } else {
      return '';
    }
  },
  areFinalityShardsDoubled() {
    return (1 + Finalities.amount()) % 64 === 0;
  },
  finalityShardGain() {
    return 16 * (1 + Finalities.amount()) * (this.areFinalityShardsDoubled() ? 2 : 1);
  },
  finalityShards() {
    return FinalityShards.amount();
  },
  newFinalityShards() {
    return this.finalityShards() + this.finalityShardGain();
  },
  totalFinalityShards() {
    return FinalityShards.total();
  },
  finalityShardGainRatio() {
    return this.finalityShardGain() / this.totalFinalityShards();
  },
  finalityShardGainRatioText() {
    if (this.totalFinalityShards() !== 0) {
      return format(this.finalityShardGainRatio()) + 'x total, ';
    } else {
      return '';
    }
  },
  finality() {
    if (!this.canFinality()) return;
    let pointGain = this.finalityPointGain();
    let shardGain = this.finalityShardGain();
    FinalityPoints.addAmount(pointGain);
    FinalityShards.addAmount(shardGain);
    Finalities.increment();
    Stats.addFinality(player.stats.timeSinceFinality, pointGain, shardGain);
    FinalityShards.maybeRespec();
    Goals.recordPrestige('finality');
    this.finalityReset();
  },
  finalityReset() {
    // We need to do this here to avoid complexity achievements being applied in the eternity reset.
    // As said below, this method shouldn't apply rewards.
    FinalityShards.initializeStartingComplexityAchievements();
    // Here are the things that complexity sometimes (but not always) fails to reset and
    // finality should always reset. They're here since (1) it's a convenient
    // distinguishing place to put them and (2) studies need to be reset first,
    // otherwise you don't enter CC6 (as you should).
    player.bestBoostPower = 1;
    player.boughtTheorems = [0, 0, 0];
    player.studies = [
      false, false, false, false, false, false,
      false, false, false, false, false, false,
      0, 0, 0, 0
    ];
    // Extra theorems seem to fit in best here, because they're theorem-related, even though
    // nothing resets them other than finality.
    player.extraTheorems = [0, 0, 0, 0];
    // This function takes care of applying the rewards for certain numbers of achievements,
    // so don't do it in initializeStartingComplexityAchievements().
    ComplexityPrestigeLayer.complexityReset();
    player.finalityStars = new Decimal(1);
    FinalityGenerators.list.forEach(x => x.resetAmount());
    player.complexityPoints = FinalityStartingBenefits.complexityPoints();
    player.complexities = FinalityStartingBenefits.complexities();
    player.complexityStars = new Decimal(1);
    player.complexityGenerators = initialComplexityGenerators(),
    player.highestComplexityGenerator = 0;
    player.complexityChallengeCompletions = [0, 0, 0, 0, 0, 0];
    player.powers = {
      seed: player.powers.seed,
      unlocked: false,
      upgrades: [0, 0, 0],
      active: [],
      stored: [],
      gain: true,
      respec: false,
      hasGainedShards: false,
      shards: 0,
      shardUpgrades: [0, 0, 0, 0],
      powerDeletionMode: player.powers.powerDeletionMode,
      presets: [],
      craft: {
        type: 'normal',
        rarity: 1,
      },
      lastData: {
        lowRarity: false,
        type: 'normal'
      },
      autoSort: {
        active: player.powers.autoSort.active,
        stored: player.powers.autoSort.stored
      }
    };
    // Note that player.oracle.timeSimulated doesn't matter here at all.
    // We let the player keep their settings since they probably want to.
    player.oracle = {
      unlocked: false,
      time: player.oracle.time,
      timeSimulated: 256,
      complexityPoints: new Decimal(0),
      complexityPointGain: new Decimal(0),
      used: false,
      alert: player.oracle.alert,
      powerDisplay: player.oracle.powerDisplay,
      powers: []
    };
    // Don't keep player.galaxy.nextDilated, since it's probably out of date.
    player.galaxies = {
      unlocked: false,
      dilated: 0,
      nextDilated: 0
    };
    player.stats.totalStarsProducedThisFinality = EternityStartingBenefits.stars().plus(FinalityStartingBenefits.stars());
    player.stats.totalInfinityStarsProducedThisFinality = new Decimal(0);
    player.stats.totalEternityStarsProducedThisFinality = new Decimal(0);
    player.stats.totalComplexityStarsProducedThisFinality = new Decimal(0);
    player.stats.totalCPProducedThisFinality = ComplexityAchievements.startingEternityPoints().plus(FinalityStartingBenefits.eternityPoints());
    player.stats.timeSinceFinality = 0;
    player.stats.lastTenComplexities = initialLastTenComplexities();
  }
}
