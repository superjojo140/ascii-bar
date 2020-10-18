const AsciiBar = require('ascii-bar').default;

const TOTAL = 10;

const bar = new AsciiBar({
    undoneSymbol: "🌧 ",
    doneSymbol: "🌤 ",
    width: 10,
    formatString: "##bright##green#spinner##default #percent #bar #message",
    total: TOTAL,
    enableSpinner: true,
    lastUpdateForTiming: false
});

const messages = [
    "Starting weather machine",
    "Detecting bad weather",
    "Compressing raindrops",
    "Prepare some fresh sunbeams",
    "Enjoy the sunshine",
    "Done"
]


function simulateProgress(current) {
    if (current <= TOTAL) {
        bar.update(current, messages[current/2]);
        setTimeout(() => simulateProgress(current + 1), 1000);
    }
}

simulateProgress(0);