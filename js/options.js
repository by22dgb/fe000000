let COMPLETION_GRADIENT_LIST = ['Default', 'Center', 'Edge', 'Reversed']

let COMPLETION_COLOR_LIST = ['On (gradient)', 'On (uniform)', 'Off'];

let TIME_DISPLAY_LIST = ['Seconds', 'D:H:M:S', 'D:H:M:S with notation', 'Largest unit'];

let Options = {
  offlineProgress() {
    return player.options.offlineProgress;
  },
  toggleOfflineProgress() {
    player.options.offlineProgress = !player.options.offlineProgress;
  },
  displayOfflineTicks() {
    return player.options.offlineTicks;
  },
  offlineTicks() {
    return Math.min(Math.max(1, Math.floor(player.options.offlineTicks)), this.maxTicks());
  },
  setOfflineTicks(x) {
    player.options.offlineTicks = x || 1;
  },
  maxTicks() {
    return Math.pow(2, 20);
  },
  toggleHotkeys() {
    player.options.hotkeys = !player.options.hotkeys;
  },
  toggleExportDisplay() {
    player.options.exportDisplay = !player.options.exportDisplay;
  },
  exportNotificationFrequency() {
    return player.options.exportNotificationFrequency;
  },
  setExportNotificationFrequency(x) {
    player.options.exportNotificationFrequency = x;
  },
  showExportNotification() {
    let frequency = this.exportNotificationFrequency();
    return 0 < frequency && frequency <= player.stats.timeSinceExport;
  },
  resetExportTime() {
    player.stats.timeSinceExport = 0;
  },
  nextCompletionColors() {
    player.options.completionColors = COMPLETION_COLOR_LIST[(COMPLETION_COLOR_LIST.indexOf(player.options.completionColors) + 1) % COMPLETION_COLOR_LIST.length];
  },
  resetColors() {
    return player.options.resetColors;
  },
  toggleResetColors() {
    player.options.resetColors = !player.options.resetColors;
  },
  tabColors() {
    return player.options.tabColors;
  },
  toggleTabColors() {
    player.options.tabColors = !player.options.tabColors;
  },
  presetHighlightColors() {
    return player.options.presetHighlightColors;
  },
  togglePresetHighlightColors() {
    player.options.presetHighlightColors = !player.options.presetHighlightColors;
  },
  notation() {
    return player.options.notation;
  },
  setNotation(x) {
    player.options.notation = x;
  },
  lowerPrecision() {
    return Math.min(Math.max(0, Math.floor(player.options.lowerPrecision)), 10);
  },
  higherPrecision() {
    return Math.min(Math.max(0, Math.floor(player.options.higherPrecision)), 10);
  },
  highestPrecision(x) {
    return 2 + Math.max(this.lowerPrecision(), this.higherPrecision())
  },
  setLowerPrecision(x) {
    player.options.lowerPrecision = (x === 0) ? 0 : (x || 3);
  },
  setHigherPrecision(x) {
    player.options.higherPrecision = (x === 0) ? 0 : (x || 5);
  },
  nextTimeDisplay() {
    player.options.timeDisplay = TIME_DISPLAY_LIST[(TIME_DISPLAY_LIST.indexOf(player.options.timeDisplay) + 1) % TIME_DISPLAY_LIST.length];
  },
  background() {
    return player.options.theme.background;
  },
  nextBackground() {
    player.options.theme.background = ['Dark', 'Light'][
      (['Dark', 'Light'].indexOf(player.options.theme.background) + 1) % 2];
    Colors.updateColors();
  },
  buttonColor() {
    return player.options.theme.buttonColor;
  },
  usualButtonColor() {
    return this.buttonColor() === 'Dull' ? 'Dull' : 'Vibrant';
  },
  nextButtonColor() {
    let options = ['Vibrant', 'Dull'];
    if (PrestigeLayerProgress.hasReached('infinity')) {
      options.push('Dull on challenges');
    }
    player.options.theme.buttonColor = options[(options.indexOf(player.options.theme.buttonColor) + 1) % options.length];
    Colors.updateColors();
  },
  completionGradients() {
    return player.options.theme.completionGradients;
  },
  nextCompletionGradients() {
    let list = PrestigeLayerProgress.hasReached('infinity') ? COMPLETION_GRADIENT_LIST : ['Default', 'Reversed'];
    player.options.theme.completionGradients = list[(list.indexOf(player.options.theme.completionGradients) + 1) % list.length];
  },
  nextEdgeGradients() {
    let options = ['Default', 'Small'];
    player.options.theme.edgeGradients = options[(options.indexOf(player.options.theme.edgeGradients) + 1) % options.length];
  },
  fitToWidth() {
    return player.options.fitToWidth;
  },
  toggleFitToWidth() {
    player.options.fitToWidth = !player.options.fitToWidth;
  },
  showNotifications(x) {
    return player.options.notifications[x];
  },
  toggleNotifications(x) {
    player.options.notifications[x] = !player.options.notifications[x];
  },
  largerCheckboxes() {
    return player.options.largerCheckboxes;
  },
  rawViewAllGenerators(type) {
    return player.options.viewAllGenerators[type];
  },
  setRawViewAllGenerators(type, x) {
    player.options.viewAllGenerators[type] = x;
  },
  actualViewAllGenerators(type) {
    // This is trivally true for every type other than normal. Still worth having
    // in case the condition changes.
    return PrestigeLayerProgress.hasReached('prestige') && this.rawViewAllGenerators(type);
  },
  showAllTabs() {
    return player.options.showAllTabs;
  },
  toggleShowAllTabs() {
    if (!player.options.showAllTabs && !confirm('Are you sure you want all tabs to be visible, ' +
    'even those you haven\'t unlocked yet? This will reveal spoilers and is primarily meant ' +
    'for replaying the game.')) {
      return;
    }
    player.options.showAllTabs = !player.options.showAllTabs;
  },
  optionDisplay(x) {
    return x || this.showAllTabs();
  },
  maxAllMode() {
    return player.options.maxAllMode;
  },
  setMaxAllMode(x) {
    player.options.maxAllMode = x;
  },
  isMaxAllModeBroad() {
    return ['All generators and upgrades', 'All generators, upgrades, and unlocks'].includes(this.maxAllMode())
  },
  truncatedMaxAllMode() {
    return this.maxAllMode().split(' ').slice(1).join(' ');
  },
  showFullOptions(x) {
    return player.options.showFullOptions[x];
  },
  toggleShowFullOptions(x) {
    player.options.showFullOptions[x] = !player.options.showFullOptions[x];
  },
  toggleLargerCheckboxes() {
    player.options.largerCheckboxes = !player.options.largerCheckboxes;
    this.updateCheckboxSize();
  },
  updateCheckboxSize() {
    document.documentElement.style.setProperty('--checkbox-scale', player.options.largerCheckboxes ? 3 : 1);
  },
  buttonOutlines() {
    return player.options.buttonOutlines;
  },
  setButtonOutlines(x) {
    player.options.buttonOutlines = x;
    this.updateButtonOutlines();
  },
  updateButtonOutlines() {
    let table = {
      'None': '#000000',
      'Black': '#000000',
      'White': '#ffffff',
      'Cyan': '#00ffff'
    }
    document.documentElement.style.setProperty('--outline-size', (player.options.buttonOutlines !== 'None') ? '1px' : '0px');
    document.documentElement.style.setProperty('--outline-color', table[player.options.buttonOutlines]);
  },
  confirmation(x) {
    return player.confirmations[x];
  },
  setConfirmation(x, y) {
    player.confirmations[x] = y;
  },
  showCurrentChallenges() {
    return player.options.headerSettings.showCurrentChallenges;
  },
  toggleShowCurrentChallenges() {
    player.options.headerSettings.showCurrentChallenges = !player.options.headerSettings.showCurrentChallenges;
  },
  showNextCCCompletion() {
    return player.options.headerSettings.showNextCCCompletion;
  },
  toggleShowNextCCCompletion() {
    player.options.headerSettings.showNextCCCompletion = !player.options.headerSettings.showNextCCCompletion;
  },
  showResetButtonsForHiddenTabs() {
    return player.options.headerSettings.showResetButtonsForHiddenTabs;
  },
  toggleShowResetButtonsForHiddenTabs() {
    player.options.headerSettings.showResetButtonsForHiddenTabs = !player.options.headerSettings.showResetButtonsForHiddenTabs;
  },
  complexityChallengeRunningColors() {
    return player.options.complexityChallengeRunningColors;
  },
  toggleComplexityChallengeRunningColors() {
    player.options.complexityChallengeRunningColors = !player.options.complexityChallengeRunningColors;
  },
  setOptionTypeShown(x) {
    player.options.optionTypeShown = x;
  },
  isOptionTypeShown(x) {
    return player.options.optionTypeShown === x;
  }
}
