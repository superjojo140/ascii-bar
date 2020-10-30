//Generate screenshot.svg with: termtosvg -c "node example/example.js" -g "80x1" -t "window_frame"

const AsciiBar = require('ascii-bar').default;
const simpleSpinner = require('ascii-bar').simpleSpinner;

const TOTAL1 = 30;
const TOTAL2 = 40;
const TOTAL3 = 10;

let bar1, bar2, bar3;

bar1 = new AsciiBar({
    width: 30,
    formatString: "#spinner #percent #bar #message",
    total: TOTAL1,
    enableSpinner: true,
    lastUpdateForTiming: false,
    hideCursor: true,
});
bar1.spinner = simpleSpinner;


function simulateProgress1(current) {
    if (current <= TOTAL1) {
        bar1.update(current, "Support for ascii only shells");
        setTimeout(() => simulateProgress1(current + 1), 200);
    }
    else{
        setTimeout(()=>{
            bar2 = new AsciiBar({
                formatString: "#spinner ##red #count #percent ##default#bar |##bright##blue Time to finish: #ttf",
                total: TOTAL2,
                enableSpinner: true,
                hideCursor:true,
            });
            simulateProgress2(1);
        },300);
    }
}

function simulateProgress2(current) {
    if(current > 12){
        bar2.formatString = "#spinner ##yellow #count #percent ##default#bar |##bright##blue Time to finish: #ttf";
    }
    if(current > 27){
        bar2.formatString = "#spinner ##green #count #percent ##default#bar |##bright##blue Time to finish: #ttf";
    }
    

    if (current <= TOTAL2) {
        bar2.update(current, "Currently at " + current);
        setTimeout(() => simulateProgress2(current + 1), 200);
    }
    else{
        setTimeout(()=>{
            bar3 = new AsciiBar({
                undoneSymbol: "🌧 ",
                doneSymbol: "🌤 ",
                width: 10,
                formatString: "#spinner##default #percent #bar #message",
                total: TOTAL3,
                enableSpinner: true,
                lastUpdateForTiming: false,
                hideCursor:true,
            });
            simulateProgress3(1);
        },300);
    }
}

const messages = [
    "Starting weather machine",
    "Detecting bad weather",
    "Compressing raindrops",
    "Prepare some fresh sunbeams",
    "Enjoy the sunshine",
    "Done"
]


function simulateProgress3(current) {
    if (current <= TOTAL3) {
        bar3.update(current, messages[current/2]);
        setTimeout(() => simulateProgress3(current + 1), 1000);
    }
}

simulateProgress1(1);