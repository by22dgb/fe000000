let Saving = {
  saveGame () {
    localStorage.setItem('fe000000-save', btoa(JSON.stringify(player)))
  },
  loadGame(s, offlineProgress) {
    // offlineProgress = null means leave it up to the save.
    player = JSON.parse(atob(s));
    if (offlineProgress === null) {
      offlineProgress = player.options.offlineProgress;
    }
    this.fixPlayer();
    this.convertSaveToDecimal();
    // We can do this after fixing Decimal.
    let now = Date.now();
    if (offlineProgress) {
      this.simulateTime((now - player.lastUpdate) / 1000);
    }
    player.lastUpdate = now;
    this.saveGame();
    updateDisplaySaveLoadSetup();
  },
  simulateTime(totalDiff) {
    let baseTickLength = 1 / 16;
    let ticks = Math.ceil(Math.min(totalDiff / baseTickLength, 1024));
    let tickLength = totalDiff / ticks;
    for (let i = 0; i < ticks; i++) {
      gameLoop(tickLength, false);
    }
  },
  fixPlayer() {
    if (player.version < 1.25) {
      // The first line here fixes a bug, the rest are due to new content.
      player.prestigePower = Decimal.max(1, player.prestigePower);
      player.infinityPoints = new Decimal(0);
      player.infinities = 0;
      player.infinityStars = new Decimal(1);
      player.infinityGenerators = initialInfinityGenerators();
      player.highestInfinityGenerator = 0;
      player.infinityUpgrades = [0, 0];
      player.version = 1.25;
    }
    if (player.version < 1.3125) {
      player.sacrificeMultiplier = new Decimal(1);
      player.stats = {
        totalStarsProduced: new Decimal(0),
        timeSincePurchase: 0,
        timeSinceSacrifice: 0,
        timeSincePrestige: 0,
        timeSinceInfinity: 0,
        timeSinceGameStart: 0,
        peakIPPerSec: new Decimal(0)
      };
      player.version = 1.3125;
    }
    if (player.version < 1.375) {
      player.currentChallenge = 0;
      player.challengesCompleted = [
        false, false, false, false, false, false,
        false, false, false, false, false, false,
      ];
      player.breakInfinity = false;
      player.stats.purchasesThisInfinity = 0;
      player.version = 1.375;
    }
    if (player.version < 1.40625) {
      player.stats.totalIPProduced = new Decimal(0);
      player.stats.fastestInfinity = Math.pow(2, 256);
      player.stats.timeSinceLastPeakIPPerSec = Math.pow(2, 256);
      player.stats.lastTenInfinities = [
        [-1, new Decimal(-1), new Decimal(-1)], [-1, new Decimal(-1), new Decimal(-1)],
        [-1, new Decimal(-1), new Decimal(-1)], [-1, new Decimal(-1), new Decimal(-1)],
        [-1, new Decimal(-1), new Decimal(-1)], [-1, new Decimal(-1), new Decimal(-1)],
        [-1, new Decimal(-1), new Decimal(-1)], [-1, new Decimal(-1), new Decimal(-1)],
        [-1, new Decimal(-1), new Decimal(-1)], [-1, new Decimal(-1), new Decimal(-1)],
      ];
      player.version = 1.40625;
    }
    if (player.version < 1.4375) {
      player.autobuyers = initialAutobuyers();
      // this is usable for testing and for cheaters
      player.cheats = {
        gameSpeed: 1,
      };
      player.version = 1.4375;
    }
    if (player.version < 1.453125) {
      player.currentInfinityChallenge = 0;
      player.infinityChallengesCompleted = [
        false, false, false, false, false, false, false, false,
      ];
      // Eternity hasn't been added yet, so this is clearly correct.
      player.stats.totalStarsProducedThisEternity = player.stats.totalStarsProduced;
      player.version = 1.453125;
    }
    if (player.version < 1.4609375) {
      player.stats.prestigesThisInfinity = 0;
      player.version = 1.4609375;
    }
    if (player.version < 1.46875) {
      player.stats.purchasesThisInfinityByType = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      player.version = 1.46875;
    }
    if (player.version < 1.5) {
      player.eternityPoints = new Decimal(0);
      player.eternities = 0;
      player.eternityStars = new Decimal(2);
      player.eternityGenerators = initialEternityGenerators();
      player.highestEternityGenerator = 0;
      player.eternityMilestonesOn = [true, true];
      player.autobuyers.push({on: false, mode: 'Amount', priority: new Decimal(2)});
      player.infinityAutobuyers = [
        false, false, false, false, false, false, false, false, false, false
      ];
      player.stats.totalEPProduced = new Decimal(0);
      player.stats.timeSinceEternity = player.stats.timeSinceGameStart;
      player.stats.timeSinceLastPeakEPPerSec = Math.pow(2, 256);
      player.stats.fastestEternity = Math.pow(2, 256);
      player.stats.peakEPPerSec = new Decimal(0);
      player.stats.lastTenEternities = initialLastTenEternities();
      player.version = 1.5;
    }
    if (player.version < 1.50625) {
      player.slowAutobuyers = [
        false, false, false, false, false, false, false, false, false,
      ];
      player.slowAutobuyersTimer = 0;
      player.version = 1.50625;
    }
    if (player.version < 1.515625) {
      player.boughtTheorems = [0, 0, 0];
      player.unspentTheorems = 0;
      player.studies = [
        false, false, false, false, false, false,
        false, false, false, false, false, false,
      ];
      player.version = 1.515625;
    }
    if (player.version < 1.5234375) {
      player.fastAutobuyersTimer = 0;
      player.autobuyersTimerLength = 0;
      player.version = 1.5234375;
    }
    if (player.version < 1.53125) {
      player.totalIPProducedThisEternity = player.totalIPProduced;
      player.version = 1.53125;
    }
    if (player.version < 1.546875) {
      player.eternityUpgrades = [0, 0];
      player.version = 1.546875;
    }
    if (player.version < 1.5625) {
      player.boostPower = 1;
      player.version = 1.5625;
    }
    if (player.version < 1.578125) {
      player.bestBoostPowerEver = 1;
      player.version = 1.578125;
    }
    if (player.version < 1.59375) {
      player.eternityUpgrades.push(0);
      player.version = 1.59375;
    }
    if (player.version < 1.609375) {
      player.eternityProducer = {
        unlocked: false,
        upgrades: [0, 0]
      };
      player.version = 1.609375;
    }
    if (player.version < 1.625) {
      // No Decimal conversion has happened yet.
      if (player.stars === "0" && player.generators.every(x => x.amount === "0")) {
        player.stars = new Decimal(2);
      }
      player.version = 1.625;
    }
    if (player.version < 1.640625) {
      player.unlockedEternityChallenge = 0;
      player.currentEternityChallenge = 0;
      player.eternityChallengeCompletions = [0, 0, 0, 0, 0, 0, 0, 0];
      player.respecEternityChallenge = false;
      player.version = 1.640625;
    }
    if (player.version < 1.65625) {
      player.permanence = 0;
      player.permanenceUpgrades = [0, 0, 0, 0];
      player.hasGainedPermanence = false;
      player.version = 1.65625;
    }
    if (player.version < 1.671875) {
      player.chroma = {
        colors: [0, 0, 0, 0, 0, 0],
        unlocked: [false, false, false, false, false, false],
        current: 0,
        next: 0
      };
      player.version = 1.671875;
    }
    if (player.version < 1.6875) {
      player.studies = player.studies.concat([0, 0, 0, 0]);
      player.version = 1.6875;
    }
    if (player.version < 1.703125) {
      player.chroma.colors = player.chroma.colors.slice(0, 5);
      player.chroma.unlocked = player.chroma.unlocked.slice(0, 5);
      player.version = 1.703125;
    }
    if (player.version < 1.71875) {
      // This variable was accidentally not defined in the inital save, with no consequence at all.
      // Still, best to define it.
      player.respecStudies = false;
      player.bestBoostPowerThisComplexity = player.bestBoostPowerEver;
      delete player.bestBoostPowerEver;
      delete player.unspentTheorems;
      player.eternities = new Decimal(player.eternities);
      player.permanence = new Decimal(player.permanence);
      player.complexityPoints = new Decimal(0);
      player.complexities = 0;
      player.complexityStars = new Decimal(1);
      player.complexityGenerators = initialComplexityGenerators();
      player.highestComplexityGenerator = 0;
      player.complexityChallengeCompletions = [0, 0, 0, 0, 0, 0];
      player.isComplexityChallengeRunning = [true, true, true, true, true, true];
      player.stats.totalStarsProducedThisComplexity = player.stats.totalStarsProduced;
      player.stats.totalEPProducedThisComplexity = player.stats.totalEPProduced
      player.stats.totalCPProduced = new Decimal(0);
      player.stats.timeSinceComplexity = player.stats.timeSinceGameStart;
      player.stats.timeSinceLastPeakCPPerSec = Math.pow(2, 256);
      player.stats.fastestComplexity = Math.pow(2, 256);
      player.stats.peakCPPerSec = new Decimal(0);
      player.stats.lastTenComplexities = initialLastTenComplexities();
      player.version = 1.71875;
    }
    if (player.version < 1.734375) {
      player.complexityChallengeSafeguards = [false, false, false, false, false];
      player.version = 1.734375;
    }
    if (player.version < 1.765625) {
      player.complexityUpgrades = [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ];
      player.version = 1.765625;
    }
    if (player.version < 1.78125) {
      player.presets = [];
      player.version = 1.78125;
    }
    if (player.version < 1.796875) {
      player.autobuyers.push({isOn: true, mode: 'X times last', priority: new Decimal(2)});
      // The loose justification for the array being arranged like this is that
      // the first 8 autobuyers are for eternity generators, and the other 9 are
      // for other things.
      player.eternityAutobuyers = [
        true, true, true, true, true, true, true, true,
        true, true, true, true, true, true, true, true, true,
      ];
      player.stats.lastPermanenceGain = new Decimal(0);
      player.stats.timeSincePermanenceGain = 0;
      player.version = 1.796875;
    }
    if (player.version < 1.8125) {
      player.stats.totalEternitiesProducedThisComplexity = player.eternities;
      player.chroma.colors.push(0);
      player.chroma.unlocked.push(false);
      player.version = 1.8125;
    }
    if (player.version < 1.828125) {
      player.isEternityChallengeRequirementDisplayOn = true;
      player.version = 1.828125;
    }
    if (player.version < 1.84375) {
      player.eternityAutobuyers = player.eternityAutobuyers.slice(0, 13).concat(
        [true, true, true], player.eternityAutobuyers.slice(13));
      player.stats.timeSinceAutoECCompletion = 0;
      player.autoECCompletion = true;
      player.usedAutoECCompletionThisComplexity = false;
      player.version = 1.84375;
    }
    if (player.version < 1.859375) {
      player.autobuyers.push({isOn: true, mode: 'Amount', priority: new Decimal(2)});
      player.bestBoostPower = player.bestBoostPowerThisComplexity;
      delete player.bestBoostPowerThisComplexity;
      player.extraTheorems = [0, 0, 0, 0];
      player.version = 1.859375;
    }
    if (player.version < 1.875) {
      player.highestBoostsBought = 0;
      player.boughtTheoremsThisComplexity = player.boughtTheorems.some(x => x !== 0);
      player.version = 1.875;
    }
  },
  convertSaveToDecimal() {
    player.stars = new Decimal(player.stars);
    player.infinityStars = new Decimal(player.infinityStars);
    player.eternityStars = new Decimal(player.eternityStars);
    player.complexityStars = new Decimal(player.complexityStars);
    player.infinityPoints = new Decimal(player.infinityPoints);
    player.eternityPoints = new Decimal(player.eternityPoints);
    player.complexityPoints = new Decimal(player.complexityPoints);
    player.sacrificeMultiplier = new Decimal(player.sacrificeMultiplier);
    player.prestigePower = new Decimal(player.prestigePower);
    for (let i = 0; i < 8; i++) {
      player.generators[i].amount = new Decimal(player.generators[i].amount);
      player.infinityGenerators[i].amount = new Decimal(player.infinityGenerators[i].amount);
      player.eternityGenerators[i].amount = new Decimal(player.eternityGenerators[i].amount);
      player.complexityGenerators[i].amount = new Decimal(player.complexityGenerators[i].amount);
    }
    player.eternities = new Decimal(player.eternities);
    player.permanence = new Decimal(player.permanence);
    player.stats.lastPermanenceGain = new Decimal(player.stats.lastPermanenceGain);
    player.stats.totalStarsProduced = new Decimal(player.stats.totalStarsProduced);
    player.stats.totalStarsProducedThisEternity = new Decimal(player.stats.totalStarsProducedThisEternity);
    player.stats.totalStarsProducedThisComplexity = new Decimal(player.stats.totalStarsProducedThisComplexity);
    player.stats.totalIPProduced = new Decimal(player.stats.totalIPProduced);
    player.stats.totalIPProducedThisEternity = new Decimal(player.stats.totalIPProducedThisEternity);
    player.stats.totalEPProduced = new Decimal(player.stats.totalEPProduced);
    player.stats.totalEPProducedThisComplexity = new Decimal(player.stats.totalEPProducedThisComplexity);
    player.stats.totalEternitiesProducedThisComplexity = new Decimal(player.stats.totalEternitiesProducedThisComplexity);
    player.stats.totalCPProduced = new Decimal(player.stats.totalCPProduced);
    player.stats.peakIPPerSec = new Decimal(player.stats.peakIPPerSec);
    player.stats.peakEPPerSec = new Decimal(player.stats.peakEPPerSec);
    player.stats.peakCPPerSec = new Decimal(player.stats.peakCPPerSec);
    for (let i = 0; i < 10; i++) {
      if (player.stats.lastTenInfinities[i] !== -1) {
        player.stats.lastTenInfinities[i][1] = new Decimal(player.stats.lastTenInfinities[i][1]);
        player.stats.lastTenInfinities[i][2] = new Decimal(player.stats.lastTenInfinities[i][2]);
      }
      if (player.stats.lastTenEternities[i] !== -1) {
        player.stats.lastTenEternities[i][1] = new Decimal(player.stats.lastTenEternities[i][1]);
        player.stats.lastTenEternities[i][2] = new Decimal(player.stats.lastTenEternities[i][2]);
      }
      if (player.stats.lastTenComplexities[i] !== -1) {
        player.stats.lastTenComplexities[i][1] = new Decimal(player.stats.lastTenComplexities[i][1]);
        player.stats.lastTenComplexities[i][2] = new Decimal(player.stats.lastTenComplexities[i][2]);
      }
    }
    for (let i = 9; i < 13; i++) {
      player.autobuyers[i].priority = new Decimal(player.autobuyers[i].priority);
    }
  },
  loadGameStorage () {
    if (!localStorage.getItem('fe000000-save')) {
      this.resetGame();
    } else {
      try {
        // We're loading from storage, player.options.offlineProgress isn't set yet.
        this.loadGame(localStorage.getItem('fe000000-save'), null);
      } catch (ex) {
        console.log('Exception while loading game, please report this.', ex);
        this.resetGame();
      }
    }
  },
  loadGamePrompt() {
    try {
      let save = prompt('Enter your save:');
      if (save && !(/^\s+$/.test(save))) {
        this.loadGame(save, player.options.offlineProgress);
      } else if (save !== null) {
        alert('The save you entered appears to be empty.');
      }
    } catch(ex) {
      alert('The save you entered does not seem to be valid. The error was ' + ex);
    }
  },
  exportGame () {
    let output = document.getElementById('export-output');
    let parent = output.parentElement;
    parent.style.display = "";
    output.value = btoa(JSON.stringify(player));
    output.focus();
    output.select();
    try {
      document.execCommand('copy');
    } catch(ex) {
      alert('Copying to clipboard failed.');
    }
  },
  resetGame() {
    // The false here sets Date.now() to when the game was reset
    // rather than when the window was loaded.
    this.loadGame(btoa(JSON.stringify(initialPlayer)), false);
  },
  resetGameWithConfirmation() {
    if (confirm('Do you really want to reset the game? You will lose all your progress, and get no benefit.')) {
      this.resetGame();
    }
  },
  // Not sure where this should live, honestly.
  gameEnd: Decimal.pow(2, 1.5 * Math.pow(2, 37))
}
