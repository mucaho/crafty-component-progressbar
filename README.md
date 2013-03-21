crafty-component-progressbar
============================

A progress bar component for the crafty JS framework.

Example

//the loading screen which will be displayed while our assets load
Crafty.scene("Loading", function () {
	Crafty.e("2D, DOM, Text")
		.attr({ w: 100, h: 20, x: 150, y: 120 })
		.text("Loading...")
		.css({ "text-align": "center" });
	
  Crafty.e("ProgressBar")
		.progressBar("LOADING_PROGRESS", 10, 100, "black", "white", 150, 140, 100, 100, 25);
	
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
