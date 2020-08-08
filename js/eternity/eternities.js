let Eternities = {
  amount() {
    return player.eternities;
  },
  totalEternitiesProducedThisComplexity() {
    return player.stats.totalEternitiesProducedThisComplexity;
  },
  add(x) {
    player.eternities = player.eternities.plus(x);
    player.stats.totalEternitiesProducedThisComplexity = player.stats.totalEternitiesProducedThisComplexity.plus(x);
  },
  setAmount(x) {
    // This is apparently only called in one place, where it represents a loss of eternities.
    player.eternities = new Decimal(x);
  },
  commonEternityGainMultiplier() {
    let factors = [
      EternityChallenge.getTotalCompletionsRewardEffect(2), PermanenceUpgrade(1).effect(),
      Chroma.effectOfColor(2), ComplexityChallenge.getComplexityChallengeReward(3),
      ComplexityAchievements.getAchievementsUnlockedRewardEffect(2),
      FinalityShardUpgrade(3).effect()
    ];
    // We use Decimal.times because the first factor is not a Decimal.
    return factors.reduce((a, b) => Decimal.times(a, b));
  },
  eternityGeneratorMultiplier() {
    // This is intentionally always at most 1, and often less.
    return Math.min(1, Math.max(1, this.amount().toNumber()) / 256);
  },
  eternityGeneratorMultiplierForDisplay() {
    // Multiply both multipliers together.
    return EternityProducer.multiplier().times(this.eternityGeneratorMultiplier());
  }
}
