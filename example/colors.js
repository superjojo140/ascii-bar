const AsciiBar = require('ascii-bar').default;

const TOTAL = 40;

const bar = new AsciiBar({
    formatString: "#spinner ##red #count #percent ##default#bar |##bright##blue Time to finish: #ttf",
    total: TOTAL,
    enableSpinner: true
});


function simulateProgress(current) {
    if(current > 12){
        bar.formatString = "#spinner ##yellow #count #percent ##default#bar |##bright##blue Time to finish: #ttf";
    }
    if(current > 27){
        bar.formatString = "#spinner ##green #count #percent ##default#bar |##bright##blue Time to finish: #ttf";
    }
    

    if (current <= TOTAL) {
        bar.update(current, "Currently at " + current);
        setTimeout(() => simulateProgress(current + 1), 200);
    }
}

simulateProgress(1);