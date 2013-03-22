/**@
* #ProgressBar
* @category Custom
* @bind CustomEvent - when the progress changes (must be triggered with a single Number 
* representing the current progress)
*
* Used to display the progress of a specific task (e.g. progress of asset loading, HP bar). 
* Internally it creates small 2D blocks representing a part of the progress spectrum. These blocks 
* are either empty or filled with respect to the current progress.
*
*/
Crafty.c("ProgressBar", {
	init: function(entity) {
		this._progressBarBlocks = {};
	},
	/**@
	* #.progressBar
	* @comp ProgressBar
	* @sign public this .progressBar(String eventName, Number blockCount, Number maxValue, 
	* String emptyColor, String filledColor, Number x, Number y, Number w, Number h, 
	* Number z, String renderMethod )
	* @param eventName - String of the event to listen to. Trigger the event directly on the entity 
	* the component gets applied to or trigger the event globally. The event object must be 
	* a 0 <= Number <= maxValue representing the current progress.
	* @param blockCount - Amount of blocks to split the progress bar to. A value of 10 would display 
	* progress in steps of 10%.
	* @param maxValue - The maximum value the incoming value can have.
	* @param emptyColor - The color for 2D blocks that are empty.
	* @param filledColor - The color for 2D blocks that are filled.
	* @param x - X position of the progress bar.
	* @param y - Y position of the progress bar.
	* @param w - Width of the progress bar (each 2D block will have w/blockCount width).
	* @param h - Height of the progress bar (each 2D block will have h height).
	* @param z - Z position of the progress bar.
	* @param renderMethod - "DOM" or "Canvas" are allowed.
	* @return this - The current entity for chaining.
	*
	* Constructor method to setup the progress bar.
	*
	* @example
	* ~~~
	* Crafty.e("ProgressBar")
	*	.progressBar("LOADING_PROGRESS", 10, 100, "black", "white", 150, 140, 100, 25, 0, "DOM");
	* ...
	* Crafty.trigger("LOADING_PROGRESS", someValue);
	* ~~~
	*/
	progressBar : function(eventName, blockCount, maxValue, emptyColor, filledColor, 
							x, y, w, h, z, renderMethod) {
		var blockWidth = w/blockCount;
		var blockValue = maxValue/blockCount;
		for (var i=0; i<blockCount; i++) {
			this._progressBarBlocks[i] = 
				Crafty.e("2D, Color, " + renderMethod)
					.attr({ x: x + i*blockWidth, y: y, w: blockWidth, h: h, z: z, 
							_progressMin: blockValue*(i+1), 
							_emptyColor: emptyColor, _filledColor: filledColor})
					.color(filledColor)
					.bind(eventName, function(e) {
						if (e >= this._progressMin)
							this.color(this._filledColor);
						else
							this.color(this._emptyColor);
					});
		}
		
		
		var progressCallback = function(event) {
			for (var key in this._progressBarBlocks) {
				if ( this._progressBarBlocks.hasOwnProperty(key) ) {
					var block = this._progressBarBlocks[key];
					block.trigger(eventName, event);
				}
			}
		};
		this.bind(eventName, progressCallback);
		this.bind("RemoveComponent", function(component) {
			if (component === "ProgressBar") {
				this.unbind(eventName, progressCallback);
			}
		});
		
		return this;
	}
});
