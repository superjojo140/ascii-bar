import AsciiBar from 'ascii-bar'
import { simpleSpinner } from "ascii-bar"

const TOTAL = 50;

const bar = new AsciiBar({
    undoneSymbol: "⋅",
    doneSymbol: ">",
    width: 20,
    formatString: "     #spinner I'm a dotty spinner",
    total: TOTAL,
    enableSpinner: true,
    lastUpdateForTiming: false,
    autoStop: true,
    print: true,
    start: 0,
    startDate: new Date().getTime(),
    stream: process.stdout,
    hideCursor:true,
});




function simulateProgress(current) {
    if (current > 24) {
        bar.spinner = simpleSpinner;
        bar.formatString =  "     #spinner I'm a simple spinner"
    }

    if (current >= TOTAL) {
        bar.stop(false);
        return;
    }

    if (current <= TOTAL) {
        bar.update(current, "Currently at " + current);
        setTimeout(() => simulateProgress(current + 1), 200);
    }
}

simulateProgress(1);