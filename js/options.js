let NOTATION_LIST = ['Scientific', 'Engineering', 'Letters', 'Standard', 'Cancer',
'Mixed scientific', 'Mixed engineering', 'Logarithm', 'Binary', 'Hexadecimal', 'Evil', 'Brackets', 'Infinity',
'Roman', 'Dots', 'Zalgo', 'Hex', 'Imperial', 'Clock', 'Prime', 'Bar', 'Shi', 'Blind'];

let COMPLETION_COLOR_LIST = ['On (gradient)', 'On (uniform)', 'Off']

let Options = {
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
    return Math.pow(2, 16);
  },
  toggleHotkeys() {
    player.options.hotkeys = !player.options.hotkeys;
  },
  toggleExportDisplay() {
    player.options.exportDisplay = !player.options.exportDisplay;
  },
  nextCompletionColors() {
    player.options.completionColors = COMPLETION_COLOR_LIST[(COMPLETION_COLOR_LIST.indexOf(player.options.completionColors) + 1) % COMPLETION_COLOR_LIST.length];
  },
  notation() {
    return player.options.notation;
  },
  setNotation(x) {
    player.options.notation = x;
  },
  theme() {
    return player.options.theme;
  },
  nextTheme() {
    player.options.theme = ['Dark', 'Light'][(['Dark', 'Light'].indexOf(player.options.theme) + 1) % 2];
    Colors.updateColors();
  },
  fitToWidth() {
    return player.options.fitToWidth;
  },
  toggleFitToWidth() {
    player.options.fitToWidth = !player.options.fitToWidth;
  },
  largerCheckboxes() {
    return player.options.largerCheckboxes;
  },
  toggleLargerCheckboxes() {
    player.options.largerCheckboxes = !player.options.largerCheckboxes;
    this.updateCheckboxSize();
  },
  updateCheckboxSize() {
    document.documentElement.style.setProperty('--checkbox-scale', player.options.largerCheckboxes ? 3 : 1);
  }
}
