let Stats = {
  addToTimeStats(diff, isOnline) {
    player.stats.timeSincePurchase += diff;
    player.stats.timeSinceSacrifice += diff;
    player.stats.timeSincePrestige += diff;
    player.stats.timeSinceInfinity += diff;
    player.stats.timeSinceEternity += diff;
    player.stats.timeSinceComplexity += diff;
    player.stats.timeSinceFinality += diff;
    player.stats.timeSinceAutoECCompletion += diff;
    player.stats.timeSincePermanenceGain += diff;
    player.stats.timeSincePowerGain += diff;
    player.stats.timeSinceOraclePrediction += diff;
    player.stats.timeSinceGameStart += diff;
    player.stats.timeSinceLastPeakIPPerSec += diff;
    player.stats.timeSinceLastPeakEPPerSec += diff;
    player.stats.timeSinceLastPeakCPPerSec += diff;
    player.stats.timeSinceLastPeakLogIPPerSec += diff;
    player.stats.timeSinceLastPeakLogEPPerSec += diff;
    player.stats.timeSinceLastPeakLogCPPerSec += diff;
    player.stats.timeSinceSacrificePossible += diff;
    player.stats.timeSincePrestigePossible += diff;
    player.stats.timeSinceIPGainWasAmount += diff;
    player.stats.timeSinceEPGainWasAmount += diff;
    player.stats.timeSinceCPGainWasAmount += diff;
    player.stats.timeSinceIPGainWasTotal += diff;
    player.stats.timeSinceEPGainWasTotal += diff;
    player.stats.timeSinceCPGainWasTotal += diff;
    player.stats.timeSinceExport += diff;
    ComplexityChallenge.addToTimeStats(diff);
    if (isOnline !== false) {
      // Note that this happens in the default case where isOnline is undefined.
      // Note also that if the game is being throttled, this makes sure each tick
      // is at most 1/8th of a second.
      player.stats.onlineTimeSinceGameStart += Math.min(diff, 1 / 8);
    }
  },
  recordPurchase(i, n) {
    player.stats.timeSincePurchase = 0;
    player.stats.purchasesThisInfinity += n;
    player.stats.purchasesThisInfinityByType[i] += n;
  },
  addInfinity(time, gain) {
    player.stats.fastestInfinity = Math.min(time, player.stats.fastestInfinity);
    player.stats.lastTenInfinities.unshift([time, gain, gain.div(time)]);
    player.stats.lastTenInfinities.pop();
  },
  addEternity(time, gain) {
    player.stats.fastestEternity = Math.min(time, player.stats.fastestEternity);
    player.stats.lastTenEternities.unshift([time, gain, gain.div(time)]);
    player.stats.lastTenEternities.pop();
  },
  addComplexity(time, gain) {
    player.stats.fastestComplexity = Math.min(time, player.stats.fastestComplexity);
    player.stats.lastTenComplexities.unshift([time, gain, gain.div(time)]);
    player.stats.lastTenComplexities.pop();
  },
  addFinality(time, pointGain, shardGain) {
    player.stats.fastestFinality = Math.min(time, player.stats.fastestFinality);
    player.stats.lastTenFinalities.unshift([time, pointGain, shardGain]);
    player.stats.lastTenFinalities.pop();
  },
  lastRunsToShow() {
    return player.stats.lastRunsToShow;
  },
  setLastRunsToShow(x) {
    player.stats.lastRunsToShow = Math.min(10, Math.max(0, x || 0));
  },
  setShowRunType(layer, b) {
    player.stats.lastRunTypesToShow[layer] = b;
  },
  key(layer) {
    return 'lastTen' + layer[0].toUpperCase() + layer.slice(1, -1) + 'ies';
  },
  showAnyRuns(x) {
    return this.lastRunsToShow() >= x;
  },
  showRunType(layer) {
    return player.stats.lastRunTypesToShow[layer];
  },
  showRun(x, layer) {
    return this.showAnyRuns(x) && this.showRunType(layer) && player.stats[this.key(layer)][x - 1][0] !== -1;
  }
}

// This is here since it's vaguely stats-related and adding a new file just for this didn't seem wise.
let FastResetText = {
  layers: ['infinity', 'eternity', 'complexity', 'finality'],
  autobuyerIndices: [12, 13, 15, 16],
  getTextForLayer(x) {
    // We need the leading space to separate from previous text.
    return ' You are currently doing fast ' + x.slice(0, -1) + 'ies due to your ' + x + ' autobuyer.'
  },
  isDoingFast(x) {
    let info = player.stats[Stats.key(x)];
    let times = info.map(x => x[0]);
    return times.every(x => x !== -1 && x <= 1) && Autobuyer(this.autobuyerIndices[this.layers.indexOf(x)]).isActive();
  },
  getText(x) {
    for (let i of this.layers) {
      if (this.isDoingFast(i)) {
        return this.getTextForLayer(i);
      }
    }
    return '';
  }
}
