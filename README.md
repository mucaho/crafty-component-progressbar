crafty-component-progressbar
============================

A progress bar component for the crafty JS framework. See ProgressBar.js for detailed documentation.

Example
```html
<html>
  <head>
    <script type="text/javascript" src="crafty.js"></script>
	<script type="text/javascript" src="ProgressBar.js"> </script>
  </head>
  <body>
    <div id="game"></div>
    <script>
	Crafty.init(500,350, document.getElementById('game'));
	
	var progressBar = Crafty.e("2D, DOM, ProgressBar")
		.attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
		// public this .progressBar(Number maxValue, Boolean flipDirection, String emptyColor, String filledColor)
		.progressBar(100, false, "blue", "green")
		// public this .updateBarProgress(Number currentValue)
		.updateBarProgress(30);
    </script>
  </body>
</html>
```
