# ascii-bar

![Screenshot - made with termToSvg](https://raw.githubusercontent.com/superjojo140/ascii-bar/main/example/screenshot.svg)

- [How to use](#how-to-use)
- [Configuration](#configuration)
    - [Template String](#template-string)
    - [Options](#options)
    - [Spinner](#spinner)
- [API Methods and properties](#api-methods-and-properties)
    - [Methods](#methods)
    - [Properties](#properties)

## Why is it cool?

- 🚀 Extreme **lightweight** (<50kB) and **zero dependencies**
- ⭕ **Fancy Spinners** (automatic ascii fallback for windows)
- 🎨 **Colors** and Emoji support (if your terminal can display this)
- 🖋️ Intuitive styling via **templateString**
- ⏰ Calculation and pretty printing of overall progress time and **time to finish**
- 🔧 Extreme customizable (configure output stream, timing calculation, spinner behavior,...)
- 📖 Typescript types and documentation

## How to use

#### Installation

````shell
    npm install ascii-bar
````

#### Basic Usage

````javascript
    const AsciiBar = require('ascii-bar').default;

    const bar = new AsciiBar();

    //in your long during task
    bar.update(numberOfDoneThings,someInfoAboutCurrentTask);
````

#### Using with `import`

````javascript
    import AsciiBar from 'ascii-bar'
````

For more examples see [examples folder](https://github.com/superjojo140/ascii-bar/tree/main/example).

## Configuration

### Template string

The `templateString` has the greatest influence on the appearance. It allows you to define which elements your status bar contains and how they are arranged.
To use a special `templateString` use it as a parameter in the constructor:

````javascript
    const bar = new AsciiBar('#spinner #percent #bar Overall time: #overall ##blue #message');
````
You can use and mix the following placeholders and modificators:

| Placeholder | Description                         | Example             |
|-------------|-------------------------------------|---------------------|
| #bar        | The visualized progress bar         | [>>>>>>>>------]    |
| #count      | Count of done tasks and total tasks | [12/42]             |
| #percent    | Percentage of done tasks            | 30%                 |
| #overall    | Estimated overall time              | 1h 12m              |
| #elapsed    | Elapsed time                        | 1d 2h 34m           |
| #ttf        | Estimated time to finish            | 34m 13s             |
| #message    | Information about the current task  | Uploading dummy.txt |
| #spinner    | A spinner                           | ⠼                   |
| ##default   | Reset text formatting               | default text        |
| ##green     | green text                          | <span style="color:green;">green text</span>           |
| ##blue      | blue text                           | <span style="color:blue;">blue text </span>           |
| ##red       | red text                            | <span style="color:red;">red text  </span>           |
| ##yellow    | yellow text                         | <span style="color:yellow;">yellow text  </span>        |
| ##bright    | bright text                         | <span style="color:lightblue;">bright blue text </span>    |
| ##dim       | dimmed text                         | <span style="color:darkgreen;">dimmed green text  </span> |


### Options

You can also use a configuration object in the constructor:

````javascript
    const bar = new AsciiBar({
        undoneSymbol: "-",
        doneSymbol: ">",
        width: 20,
        formatString: '#percent #bar',
        total: 100,
        enableSpinner: false,
        lastUpdateForTiming: false,
        autoStop : true,
        print: true,
        start: 0,
        startDate: new Date().getTime(),
        stream: process.stdout,
        hideCursor: false,
    });
````

For more detailed explanation off all these options have a look at the [AsciiBar.d.ts](dist/AsciiBar.d.ts#L91)

### Spinner

![Screenshot - made with termToSvg](https://raw.githubusercontent.com/superjojo140/ascii-bar/main/example/spinner.svg)

#### Use a spinner

To use a spinner simply set the `enableSpinner` option to `true`.
Also use the `#spinner` placeholder in your template string.

Minimal example:

````javascript
    const bar = new AsciiBar({
        formatString: '#spinner #percent #bar',
        enableSpinner: true
    });
````

#### Modify spinner

You can also set a [custom spinner](dist/AsciiBar.d.ts#L164)   
For more spinner inspiration see [cli-spinners](https://www.npmjs.com/package/cli-spinners)

````javascript
    bar.spinner = {
        interval: 100,
        frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }   
````

## API Methods and properties

### Methods

````javascript
    /**
     * update the progress. This will trigger re-rendering the progressbar
     * @param current - the new absolute progress value
     * @param message - [optional] update the message displayed at the #message placeholder
     */
    bar.update(current: number, message?: string)

     /**
     * Creates the progressbar string with all configured settings
     * @returns a string representating the progressbar
     */
    bar.renderLine(): string 

    /**
     * Stop the progressbar
     * This will stop the spinner and change it's symbol to a checkmark (if not disabled)
     * Message will be changed to a string describing the elapsed time (if not disabled)
     * This function will be triggered automatically if the progressbar reaches 100% (if not disabled)
     * @param withInfo - wether to auto-update the progressbar's spinner and message after stopping
     */
    bar.stop(withInfo = true) 
````


### Properties

All of this properties can be changed (even while the progressbar is running).

E.g. to set a new message text do:

````javascript
    bar.message = "SomeNewText";
````

````javascript
    /**
     * Format of the displayed progressbar
     */
    public formatString = '#percent #bar';

    /**
    * Number of steps to finish progress
    */
    public total = 100;

    /**
     * Startdate to calculate elapsed time (in milliseconds)
     */
    public startDate = new Date().getTime();

    /**
     * Which time span to use for timing calculation - If you are unsure always use false here!
     */
    public lastUpdateForTiming = false;

    /**
     * Width of the progress bar (only the #bar part)
     */
    public width = 20;

    /**
    * Symbol for the done progress in the #bar part
    */
    public doneSymbol = ">";

    /**
    * Symbol for the undone progress in the #bar part
    */
    public undoneSymbol = "-";

    /**
    * Wether to print to configured stream or not
    */
    public print = true;

    /**
     * A spinner object describing how the spinner looks like
     * Change this for another spinner
     */
    public spinner = defaultSpinner;

    /**
     * The message displayed at the #message placeholder
     */
    public message = "";

    /**
    * wether to call progressbar's stop() function automatically if the progress reaches 100%
    */
    public autoStop = true;

      /**
     * wether to hide the terminal's cursor while displaying the progress bar
     * cursor will be re-enabled by the bar.stop() function
     * @default false
     */
    hideCursor?: boolean;
````
