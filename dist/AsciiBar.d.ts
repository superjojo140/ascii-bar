/// <reference types="node" />
export default class AsciiBar {
    /**
     * Format of the displayed progressbar
     */
    formatString: string;
    /**
    * Number of steps to finish progress
    */
    total: number;
    /**
     * Startdate to calculate elapsed time (in milliseconds)
     */
    startDate: number;
    /**
     * Which timespan to use for timing calculation - If you are unsure allways use false here!
     */
    lastUpdateForTiming: boolean;
    /**
     * Width of the progress bar (only the #bar part)
     */
    width: number;
    /**
    * Symbol for the done progress in the #bar part
    */
    doneSymbol: string;
    /**
    * Symbol for the undone progress in the #bar part
    */
    undoneSymbol: string;
    /**
    * Wether to print to configured stream or not
    */
    print: boolean;
    /**
     * A spinner object describing how the spinner looks like
     * Change this for another spinner
     */
    spinner: Spinner;
    /**
     * The message displayed at the #message placeholder
     */
    message: string;
    /**
    * wether to call progressbar's stop() function automatically if the progress reaches 100%
    */
    autoStop: boolean;
    /**
    * wether to hide the terminal's cursor while displaying the progress bar
    */
    hideCursor: boolean;
    private elapsed;
    private lastUpdate;
    private timeToFinish;
    private overallTime;
    private stream;
    private spinnerTimeout;
    private enableSpinner;
    private currentSpinnerSymbol;
    private current;
    constructor(options?: string | ProgressbarOptions);
    /**
     * Creates the progressbar string with all configured settings
     * @returns a string representating the progressbar
     */
    renderLine(): string;
    /**
     * Render the progressbar and print it to output stream
     */
    printLine(): void;
    /**
     * update the progress. This will trigger re-rendering the progressbar
     * @param current the new absolute progress value
     * @param message [optional] update the message displayed at the #message placeholder
     */
    update(current: number, message?: string): this;
    /**
     * Updates the spinner if enabled
     */
    private updateSpinner;
    /**
     * Formats a time span (given in milliseconds) to a easy human readable string
     * @param millis timespan in milliseconds
     */
    private formatTime;
    /**
     * Stop the progressbar
     * This will stop the spinner and change it's symbol to a checkmark (if not disabled)
     * Message will be changed to a string describing the elapsed time (if not disabled)
     * This function will be triggered automatically if the progressbar reaches 100% (if not disabled)
     * @param withInfo wether to auto-update the progressbar's spinner and message after stopping
     */
    stop(withInfo?: boolean): void;
}
interface ProgressbarOptions {
    /**
     * Format of the displayed progressbar
     * Use serveral of this placeholders:
     * #bar #count #percent #overall #elapsed #ttf #message #spinner
     * And combine with serveral of this formatters:
     * ##default ##green ##blue ##red ##yellow ##bright ##dim
     * @default '#percent #bar'
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
     * @default '-'
     */
    undoneSymbol?: string;
    /**
     * Wether to print to configured stream or not
     * If set to false get the currently rendered statusbar with bar.renderLine()
     * @default true
     */
    print?: boolean;
    /**
     * Start value of progress
     * @default 0
     */
    start?: number;
    /**
     * Wether to enable the spinner update function or not.
     * If enabled the statusbar will re-render automatically every few seconds to update the spinner symbol
     * Make sure to include #spinner in formatString to use spinner symbol
     * @default false
     */
    enableSpinner?: boolean;
    /**
     * Which timespan to use for timing calculation - If you are unsure allways use false here!
     * set to FALSE: Assume that each of the remaining steps will take as long as THE AVERAGE OF ALL the previous steps
     * set to TRUE: Assume that eah of the remaining steps will take as long as THE LAST STEP took. WARNING: This implies, that every call of the ProgressBar.update() function increment the state with the same stepwidth.
     * @default false using overall elapsed time for timing calculation
     */
    lastUpdateForTiming?: boolean;
    /**
     * wether to call progressbar's stop() function automatically if the progress reaches 100%
     * @default true
     */
    autoStop?: boolean;
    /**
    * wether to hide the terminal's cursor while displaying the progress bar
    * cursor will be re-enabled by the bar.stop() function
    * @default false
    */
    hideCursor?: boolean;
}
export declare let defaultSpinner: Spinner;
export declare let simpleSpinner: Spinner;
interface Spinner {
    /**
     * Number of milliseconds to update to the next spinner frame
     */
    interval: number;
    /**
     * Array of the spinner "frames"
     * A frame means one char
     */
    frames: string[];
    /**
     * Used in runtime to store currently displayed frame
     * @default 0
     */
    currentFrame?: number;
}
export {};
