crafty-component-progressbar
============================

A progress bar component for the crafty JS framework. See ProgressBar.js for detailed documentation.

Example

	//the loading screen which will be displayed while our assets load
	Crafty.scene("Loading", function () {
		Crafty.e("ProgressBar")
			// public this .progressBar( String eventName, Number blockCount, Number maxValue, 
			// 	String emptyColor, String filledColor, Number x, Number y, Number w, Number h, 
			// 	Number z, String renderMethod )
	    		.progressBar("LOADING_PROGRESS", 10, 100, "black", "white", 150, 140, 100, 25, 100, "DOM");
		
		Crafty.load(["<put your assets here>"],
			function() {
				//when loaded
				Crafty.scene("main"); //go to main scene
			},
			function(e) {
				//progress
				Crafty.trigger("LOADING_PROGRESS", e.percent);
			},
			function(e) {
				//error
			}
		);
	});
