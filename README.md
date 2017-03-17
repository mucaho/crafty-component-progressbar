Crafty Component Progressbar
============================

A progress bar component for the [CraftyJS](http://craftyjs.com/) HTML5 game engine.  
See [ProgressBar.js](ProgressBar.js) for detailed documentation or [example_progressbar.html](example_progressbar.html) for the complete example.

Example
```javascript
// the loading screen which will be displayed while our assets load
Crafty.scene("Loading", function () {
    Crafty.e("2D, DOM, Text")
        .attr({ w: 100, h: 20, x: 150, y: 120 })
        .text("Loading...")
        .css({ "text-align": "center" });

    Crafty.e("2D, DOM, ProgressBar")
        .attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
        // progressBar(Number maxValue, Boolean flipDirection, String emptyColor, String filledColor)
        .progressBar(100, false, "blue", "green")
        .bind("LOADING_PROGRESS", function(percent) {
            // updateBarProgress(Number currentValue)
            this.updateBarProgress(percent);
        });

    Crafty.load(["<put your assets here>"],
        function() { // when loaded
            Crafty.scene("main"); //go to main scene
        },
        function(e) { // on progress
            Crafty.trigger("LOADING_PROGRESS", e.percent);
        },
        function(e) { // on error
        }
    );
});
```
