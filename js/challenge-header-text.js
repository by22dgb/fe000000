let ChallengeHeaderText = {
  getText() {
    let runningComplexityChallenges = [1, 2, 3, 4, 5, 6].filter(x => ComplexityChallenge.isComplexityChallengeRunning(x));
    let challenges = [
      Challenge.isSomeChallengeRunning() ? 'Challenge ' + Challenge.currentChallenge() : null,
      InfinityChallenge.isSomeInfinityChallengeRunning() ? 'Infinity Challenge ' + InfinityChallenge.currentInfinityChallenge() : null,
      EternityChallenge.isSomeEternityChallengeRunning() ? 'Eternity Challenge ' + EternityChallenge.currentEternityChallenge() : null,
      (runningComplexityChallenges.length > 0 && PrestigeLayerProgress.hasReached('complexity')) ?
      'Complexity Challenge' + pluralize(runningComplexityChallenges.length, '', 's') + ' ' + coordinate('*', '', runningComplexityChallenges) : null
    ];
    return coordinate('You are currently in *.', 'You are currently not in any challenge.', challenges);
  }
}
