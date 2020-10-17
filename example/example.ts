import AsciiBar from 'ascii-bar'

const TOTAL = 40;

const bar = new AsciiBar({
    undoneSymbol: "⋅",
    doneSymbol: ">",
    width: 20,
    formatString: '#spinner #percent #bar',
    total: TOTAL,
    enableSpinner: true,
    lastUpdateForTiming: false,
    autoStop: true,
    print: true,
    start: 0,
    startDate: new Date().getTime(),
    stream: process.stdout
});

bar.spinner = {
    interval: 100,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
}


function simulateProgress(current) {
    if (current <= TOTAL) {
        bar.update(current, "Currently at " + current);
        setTimeout(() => simulateProgress(current + 1), 200);
    }
}

simulateProgress(1);