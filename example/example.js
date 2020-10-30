const AsciiBar = require('ascii-bar').default;

const TOTAL = 40;

const bar = new AsciiBar({
    undoneSymbol: "-",
    doneSymbol: "x",
    width: 30,
    formatString: "##bright##blue#spinner##default#percent #bar Zeit: #elapsed + #ttf = #overall  #message",
    total: TOTAL,
    enableSpinner: true,
    lastUpdateForTiming: false,
});


function simulateProgress(current) {
    if (current <= TOTAL) {
        bar.update(current, "Currently at " + current);
        setTimeout(() => simulateProgress(current + 1), 200);
    }
}

simulateProgress(1);