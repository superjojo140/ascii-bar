export class AsciiBar {
    public formatString = '#percent #bar';
    public total = 100;
    public elapsed = 0;
    public startDate = new Date().getTime();
    public lastUpdate = new Date().getTime();
    public lastUpdateForTiming = false;
    public timeToFinish = 0;
    public overallTime = 0;
    public stream = process.stdout;
    public width = 20;
    public doneSymbol = ">";
    public undoneSymbol = "⋅";
    public print = true;
    public spinner = defaultSpinner;
    public message = "";

    private spinnerTimeout;
    private enableSpinner = false;
    private currentSpinnerSymbol = "";
    private current = 0;

    constructor(options?: string | ProgressbarOptions) {
        if (options) {
            if (typeof options == "string") {
                options = { formatString: options }
            }

            for (const opt in options) {
                this[opt] = options[opt];
            }

            if (this.enableSpinner) {
                this.spinnerTimeout = setTimeout(this.updateSpinner, this.spinner.interval);
            }
        }
    }

    updateSpinner = () => {
        this.spinner.currentFrame = (this.spinner.currentFrame + 1) % this.spinner.frames.length;
        this.currentSpinnerSymbol = this.spinner.frames[this.spinner.currentFrame];
        this.printLine();
        this.spinnerTimeout = setTimeout(this.updateSpinner, this.spinner.interval);
    }

    renderLine() {
        let plusCount = Math.round(this.current / this.total * this.width);
        let minusCount = this.width - plusCount;
        let plusString = "";
        let minusString = "";
        for (let i = 0; i < plusCount; i++) { plusString += this.doneSymbol; }
        for (let i = 0; i < minusCount; i++) { minusString += this.undoneSymbol; }
        let barString = `[${plusString}${minusString}]`;

        let currentString = String(this.current);
        while (currentString.length < String(this.total).length) { currentString = "0" + currentString; }
        let countString = `[${currentString}/${this.total}]`;

        let percentString = String(Math.round((this.current / this.total) * 100));
        while (percentString.length < 3) { percentString = " " + percentString; }
        percentString += "%";

        let overAllString = this.formatTime(this.overallTime);
        let elapsedString = this.formatTime(this.elapsed);
        let ttfString = this.formatTime(this.timeToFinish);

        //Replace macros
        let line = this.formatString.replace(/#bar/g, barString).replace(/#count/g, countString).replace(/#percent/g, percentString).replace(/#overall/g, overAllString).replace(/#elapsed/g, elapsedString).replace(/#ttf/g, ttfString).replace(/#message/g, this.message).replace(/#spinner/g, this.currentSpinnerSymbol);

        //Colors :-)
        line = line.replace(/##default/g, colorCodes.Reset).replace(/##green/g, colorCodes.Green).replace(/##blue/g, colorCodes.Blue).replace(/##red/g, colorCodes.Red).replace(/##yellow/g, colorCodes.Yellow).replace(/##bright/g, colorCodes.Bright).replace(/##dim/g, colorCodes.Dim);
        line += colorCodes.Reset;

        return line;
    }

    printLine() {
        if (!this.print) { return; }
        this.stream.cursorTo(0);
        this.stream.write(this.renderLine());
        this.stream.clearLine(1);
    }

    update(current: number, message?) {
        this.current = current;

        if (message) { this.message = message; }

        //timePerTick * max = overallTime
        //timePerTick = elapsed / current
        //overallTime = (elapsed / current) * max
        //timeToFinish = overallTime - elapsed
        let now = new Date().getTime();
        //how to calculate time per step
        let timePerStep = this.lastUpdateForTiming ? (now - this.lastUpdate) : (this.elapsed / this.current);
        this.elapsed = now - this.startDate;
        this.overallTime = (timePerStep * this.total);
        this.timeToFinish = (timePerStep * (this.total - this.current));
        this.printLine()

        //Stop if finished
        if (this.current / this.total >= 1) { this.stop() }

        this.lastUpdate = now;
        return this
    }

    formatTime(millis: number) {
        //Milliseconds
        if (millis < 500) {
            return `${Math.round(millis)}ms`;
        }
        //Seconds
        if (millis < 60 * 1000) {
            return `${Math.round(millis / 1000)}s`;
        }
        //Minutes
        if (millis < 60 * 60 * 1000) {
            let minutes = Math.round(millis / (1000 * 60));
            let seconds = Math.round(millis % (1000 * 60) / 1000);
            return `${minutes}m ${seconds}s`;
        }
        //Hours
        if (millis < 24 * 60 * 60 * 1000) {
            let hours = Math.round(millis / (1000 * 60 * 60));
            let minutes = Math.round(millis % (1000 * 60 * 60) / (1000 * 60));
            return `${hours}h ${minutes}m`;
        }
        //Days
        let days = Math.round(millis / (1000 * 60 * 60 * 24));
        let hours = Math.round(millis % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        let minutes = Math.round(millis % (1000 * 60 * 60) / (1000 * 60));
        return `${days}d ${hours}h ${minutes}m`;
    }

    stop() {
        //Stop the spinner
        if (this.spinnerTimeout) {
            clearTimeout(this.spinnerTimeout);
        }
        //change spinner to checkmark
        this.currentSpinnerSymbol = colorCodes.Green + colorCodes.Bright + "✓" + colorCodes.Reset;
        //set overalltime to really elapsed time
        this.overallTime = this.elapsed;
        this.message = `Finished in ${this.formatTime(this.overallTime)}`
        this.printLine();
        //add newline
        console.log();
    }
}

interface ProgressbarOptions {
    /**
     * Format of the dipslayed statusbar
     * @default '#percent #bar'
     * Use serveral of this placeholders:
     * #bar #count #percent #overall #elapsed #ttf #message #spinner
     * And combine with serveral of this formats:
     * ##default ##green ##blue ##red ##yellow ##bright ##dim
     * @example '##bright##blue#spinner##default #percent #bar Elapsed: #elapsed Time to finish: #ttf  #message'
     */

    formatString?: string;
    /**
     * Number of steps to finish progress
     * @default 100
     */
    total?: number;

    /**
     * Startdate to calculate elapsed time (in milliseconds)
     * Use this if the progress started before initialising the progressbar
     * @default 'new Date().getTime()'
     */
    startDate?: number;

    /**
     * Stream to print the progressbar
     * @default process.stdout
     */
    stream?: NodeJS.ReadWriteStream;

    /**
     * Width of the progress bar (only the #bar part)
     * @default 20
     */
    width?: number;

    /**
     * Symbol for the done progress in the #bar part
     * @default '>'
     */
    doneSymbol?: string;

    /**
     * Symbol for the undone progress in the #bar part
     * @default '⋅'
     */
    undoneSymbol?: string;

    /**
     * Wether to print to configured stream or not
     * @default true
     * If set to false get the currently rendered statusbar with bar.renderLine()
     */
    print?: boolean;

    /**
     * Start value of progress
     * @default 0
     */
    current?: number;

    /**
     * Wether to enable the spinner update function or not.
     * @default false
     * If enabled the statusbar will re-render automatically every few seconds to update the spinner symbol
     * Make sure to include #spinner in formatString to use spinner symbol
     */
    enableSpinner?: boolean;
    
    /**
     * Wether to use last update for timing calculation or overall elapsed time
     * If you are unsure allways use false here!
     * @default: false (using overall elapsed time for timing calculation)
     * If set to true: using elapsed time for the last step for timing calculation. WARNING: This implies, that every call of the ProgressBar.update() function increment the state with the same stepwidth.
     */
    lastUpdateForTiming?: boolean;
}

//ColorCodes from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const colorCodes = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
}

let defaultSpinner: Spinner = {
    interval: 120,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    currentFrame: 0
}

interface Spinner {
    interval: number;
    frames: string[];
    currentFrame: number;
}
