crafty-component-progressbar
============================

A progress bar component for the crafty JS framework. See ProgressBar.js for detailed documentation.

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
        function(e) { // progress
            Crafty.trigger("LOADING_PROGRESS", e.percent);
        },
        function(e) { // error
        }
    );
});
```
