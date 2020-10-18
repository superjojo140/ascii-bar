# ascii-bar
A lightweight ascii progress bar for the nodejs console

## Why is it cool?

- 🚀 Extremly lightweight (<10kB) and zero dependencies
- ⭕ Fancy Spinners
- 🌈 Unicode support (Emojis, special characters,...)
- 🎨 Colors
- 🖋️ Intuitive styling via templateString
- ⏰ Calculation and pretty printing of overall progress time and time to finish
- 🔧 Extremly customisable (configure output stream, timing calculation, spinner behavior,...)
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

For more examples see [examples folder](/examples).

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
| #bar        | The visualised progress bar         | [>>>>>>>>------]    |
| #count      | Count of done tasks and total taksk | [12/42]             |
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
| ##dim       | dimmed text                         | <span style="color:darkgreen;">dimmmed green text  </span> |


### More Configuration

You can also use a configuration object in the constructor:

````javascript
    const bar = new AsciiBar({
        undoneSymbol: "⋅",
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
        stream: process.stdout
    });
````

For more detailed explanation off all these options have a look at the [AsciiBar.d.ts](dist/AsciiBar.d.ts#L91)

### Spinner

To use a spinner simply set the `enableSpinner: true` option in configuration object.
Also use the `#spinner` placeholder in your template string.

Minimal example:

````javascript
    const bar = new AsciiBar({
        formatString: '#spinner #percent #bar',
        enableSpinner: false
    });
````

#### Modify spinner

You can also set a [custom spinner](dist/AsciiBar.d.ts#L164):

````javascript
    bar.spinner = {
        interval: 100,
        frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }   
````

## API

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
