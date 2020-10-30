"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsciiBar = /** @class */ (function () {
    function AsciiBar(options) {
        var _this = this;
        /**
         * Format of the displayed progressbar
         */
        this.formatString = '#percent #bar';
        /**
        * Number of steps to finish progress
        */
        this.total = 100;
        /**
         * Startdate to calculate elapsed time (in milliseconds)
         */
        this.startDate = new Date().getTime();
        /**
         * Which timespan to use for timing calculation - If you are unsure allways use false here!
         */
        this.lastUpdateForTiming = false;
        /**
         * Width of the progress bar (only the #bar part)
         */
        this.width = 20;
        /**
        * Symbol for the done progress in the #bar part
        */
        this.doneSymbol = ">";
        /**
        * Symbol for the undone progress in the #bar part
        */
        this.undoneSymbol = "-";
        /**
        * Wether to print to configured stream or not
        */
        this.print = true;
        /**
         * A spinner object describing how the spinner looks like
         * Change this for another spinner
         */
        this.spinner = exports.defaultSpinner;
        /**
         * The message displayed at the #message placeholder
         */
        this.message = "";
        /**
        * wether to call progressbar's stop() function automatically if the progress reaches 100%
        */
        this.autoStop = true;
        /**
        * wether to hide the terminal's cursor while displaying the progress bar
        */
        this.hideCursor = false;
        this.elapsed = 0;
        this.lastUpdate = new Date().getTime();
        this.timeToFinish = 0;
        this.overallTime = 0;
        this.stream = process.stdout;
        this.enableSpinner = false;
        this.currentSpinnerSymbol = "";
        this.current = 0;
        /**
         * Updates the spinner if enabled
         */
        this.updateSpinner = function () {
            if (_this.spinner.currentFrame === undefined) {
                _this.spinner.currentFrame = 0;
            }
            _this.spinner.currentFrame = (_this.spinner.currentFrame + 1) % _this.spinner.frames.length;
            _this.currentSpinnerSymbol = _this.spinner.frames[_this.spinner.currentFrame];
            _this.printLine();
            _this.spinnerTimeout = setTimeout(_this.updateSpinner, _this.spinner.interval);
        };
        if (options) {
            //if only a string was provided, use this as formatString
            if (typeof options == "string") {
                options = { formatString: options };
            }
            //set other options
            for (var opt in options) {
                if (this[opt] !== undefined) {
                    this[opt] = options[opt];
                }
            }
            //set start value
            if (options.start) {
                this.current = options.start;
            }
            //use simple spinner on windows
            if (process.platform === 'win32') {
                this.spinner = exports.simpleSpinner;
            }
            //enable spinner
            if (this.enableSpinner) {
                this.spinnerTimeout = setTimeout(this.updateSpinner, this.spinner.interval);
            }
        }
    }
    /**
     * Creates the progressbar string with all configured settings
     * @returns a string representating the progressbar
     */
    AsciiBar.prototype.renderLine = function () {
        var plusCount = Math.round(this.current / this.total * this.width);
        var minusCount = this.width - plusCount;
        var plusString = "";
        var minusString = "";
        for (var i = 0; i < plusCount; i++) {
            plusString += this.doneSymbol;
        }
        for (var i = 0; i < minusCount; i++) {
            minusString += this.undoneSymbol;
        }
        var barString = "[" + plusString + minusString + "]";
        var currentString = String(this.current);
        while (currentString.length < String(this.total).length) {
            currentString = "0" + currentString;
        }
        var countString = "[" + currentString + "/" + this.total + "]";
        var percentString = String(Math.round((this.current / this.total) * 100));
        while (percentString.length < 3) {
            percentString = " " + percentString;
        }
        percentString += "%";
        var overAllString = this.formatTime(this.overallTime);
        var elapsedString = this.formatTime(this.elapsed);
        var ttfString = this.formatTime(this.timeToFinish);
        //Replace macros
        var line = this.formatString.replace(/#bar/g, barString).replace(/#count/g, countString).replace(/#percent/g, percentString).replace(/#overall/g, overAllString).replace(/#elapsed/g, elapsedString).replace(/#ttf/g, ttfString).replace(/#message/g, this.message).replace(/#spinner/g, this.currentSpinnerSymbol);
        //Colors :-)
        line = line.replace(/##default/g, colorCodes.Reset).replace(/##green/g, colorCodes.Green).replace(/##blue/g, colorCodes.Blue).replace(/##red/g, colorCodes.Red).replace(/##yellow/g, colorCodes.Yellow).replace(/##bright/g, colorCodes.Bright).replace(/##dim/g, colorCodes.Dim);
        line += colorCodes.Reset;
        //Hide cursor
        if (this.hideCursor) {
            line = colorCodes.HideCursor + line;
        }
        return line;
    };
    /**
     * Render the progressbar and print it to output stream
     */
    AsciiBar.prototype.printLine = function () {
        if (!this.print) {
            return;
        }
        this.stream.cursorTo(0);
        this.stream.write(this.renderLine());
        this.stream.clearLine(1);
    };
    /**
     * update the progress. This will trigger re-rendering the progressbar
     * @param current the new absolute progress value
     * @param message [optional] update the message displayed at the #message placeholder
     */
    AsciiBar.prototype.update = function (current, message) {
        this.current = current;
        if (message) {
            this.message = message;
        }
        //timePerTick * max = overallTime
        //timePerTick = elapsed / current
        //overallTime = (elapsed / current) * max
        //timeToFinish = overallTime - elapsed
        var now = new Date().getTime();
        //how to calculate time per step
        var timePerStep = this.lastUpdateForTiming ? (now - this.lastUpdate) : (this.elapsed / this.current);
        this.elapsed = now - this.startDate;
        this.overallTime = (timePerStep * this.total);
        this.timeToFinish = (timePerStep * (this.total - this.current));
        this.printLine();
        //Stop if finished
        if (this.autoStop && (this.current / this.total >= 1)) {
            this.stop();
        }
        this.lastUpdate = now;
        return this;
    };
    /**
     * Formats a time span (given in milliseconds) to a easy human readable string
     * @param millis timespan in milliseconds
     */
    AsciiBar.prototype.formatTime = function (millis) {
        //Milliseconds
        if (millis < 500) {
            return Math.round(millis) + "ms";
        }
        //Seconds
        if (millis < 60 * 1000) {
            return Math.round(millis / 1000) + "s";
        }
        //Minutes
        if (millis < 60 * 60 * 1000) {
            var minutes_1 = Math.round(millis / (1000 * 60));
            var seconds = Math.round(millis % (1000 * 60) / 1000);
            return minutes_1 + "m " + seconds + "s";
        }
        //Hours
        if (millis < 24 * 60 * 60 * 1000) {
            var hours_1 = Math.round(millis / (1000 * 60 * 60));
            var minutes_2 = Math.round(millis % (1000 * 60 * 60) / (1000 * 60));
            return hours_1 + "h " + minutes_2 + "m";
        }
        //Days
        var days = Math.round(millis / (1000 * 60 * 60 * 24));
        var hours = Math.round(millis % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.round(millis % (1000 * 60 * 60) / (1000 * 60));
        return days + "d " + hours + "h " + minutes + "m";
    };
    /**
     * Stop the progressbar
     * This will stop the spinner and change it's symbol to a checkmark (if not disabled)
     * Message will be changed to a string describing the elapsed time (if not disabled)
     * This function will be triggered automatically if the progressbar reaches 100% (if not disabled)
     * @param withInfo wether to auto-update the progressbar's spinner and message after stopping
     */
    AsciiBar.prototype.stop = function (withInfo) {
        if (withInfo === void 0) { withInfo = true; }
        //Stop the spinner
        if (this.spinnerTimeout) {
            clearTimeout(this.spinnerTimeout);
        }
        if (withInfo) {
            //change spinner to checkmark
            this.currentSpinnerSymbol = colorCodes.Green + colorCodes.Bright + "✓" + colorCodes.Reset;
            if (process.platform === 'win32') {
                this.currentSpinnerSymbol = "OK ";
            }
            ;
            //set overalltime to really elapsed time
            this.overallTime = this.elapsed;
            this.message = "Finished in " + this.formatTime(this.overallTime);
            this.printLine();
        }
        //add newline and re-enable cursor
        console.log(this.hideCursor ? colorCodes.ShowCursor : "");
    };
    return AsciiBar;
}());
exports.default = AsciiBar;
//ColorCodes from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
var colorCodes = {
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
    HideCursor: "\x1B[?25l",
    ShowCursor: "\x1B[?25h",
};
exports.defaultSpinner = {
    interval: 120,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
};
exports.simpleSpinner = {
    interval: 120,
    frames: ["-", "\\", "|", "/"]
};
