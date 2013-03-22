/**@
* #ProgressBar
* @category Custom
* @bind CustomEvent - when the progress changes (must be triggered with a single Number 
* representing the current progress)
*
* Used to display the progress of a specific task (e.g. progress of asset loading, HP bar). 
* Internally it creates small 2D blocks representing a part of the progress spectrum. These blocks 
* are either empty or filled with respect to the current progress. Changes to the progress bar's 
* 2D properties are reflected on to the blocks.
*
*/
Crafty.c("ProgressBar", {
	init: function(entity) {
		this.requires("2D");
		this._progressBarBlocks = [];
	},
	_updateBlocks: function() {
		var entity = this;
		var blockWidth = entity.w / entity._progressBarBlocks.length;
		
		for (var i = 0; i < this._progressBarBlocks.length; i++) {
			var block = this._progressBarBlocks[i];
			block.attr({ x: entity.x + i*blockWidth, y: entity.y, 
						w: blockWidth, h: entity.h, z: entity.z });
		}
	},
	/**@
	* #.progressBar
	* @comp ProgressBar
	* @sign public this .progressBar(String eventName, Number blockCount, Number maxValue, 
	* String emptyColor, String filledColor, String renderMethod)
	* @param eventName - String of the event to listen to. Trigger the event directly on the entity 
	* the component gets applied to or trigger the event globally. The event object must be 
	* a 0 <= Number <= maxValue representing the current progress.
	* @param blockCount - Amount of blocks to split the progress bar to. A value of 10 would display 
	* progress in steps of 10%.
	* @param maxValue - The maximum value the incoming value can have.
	* @param emptyColor - The color for 2D blocks that are empty.
	* @param filledColor - The color for 2D blocks that are filled.
	* @param renderMethod - The render method for the blocks. "DOM" or "Canvas" are allowed.
	* @return this - The current entity for chaining.
	*
	* Constructor method to setup the progress bar.
	*
	* @example
	* ~~~
	* Crafty.e("2D, ProgressBar")
	*	.attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
	*	.progressBar("LOADING_PROGRESS", 10, 100, "black", "white", "DOM");
	* ...
	* Crafty.trigger("LOADING_PROGRESS", someValue);
	* ~~~
	*/
	progressBar : function(eventName, blockCount, maxValue, emptyColor, filledColor, renderMethod) {		
		var blockValue = maxValue / blockCount;
		
		for (var i = 0; i < blockCount; i++) {
			this._progressBarBlocks.push(
				Crafty.e("2D, Color, " + renderMethod)
					.attr({ _progressMin: blockValue*(i+1), 
							_emptyColor: emptyColor, _filledColor: filledColor})
					.color(filledColor)
					.bind(eventName, function(e) {
						if (e >= this._progressMin)
							this.color(this._filledColor);
						else
							this.color(this._emptyColor);
					}));
		}
		
		this._updateBlocks();
		
		var progressCallback = function(event) {
			for (var i = 0; i < this._progressBarBlocks.length; i++) {
				var block = this._progressBarBlocks[i];
				block.trigger(eventName, event);
			}
		}
		this.bind(eventName, progressCallback);
		this.bind("Change", this._updateBlocks);
		this.bind("RemoveComponent", function(component) {
			if (component === "ProgressBar") {
				this.unbind(eventName, progressCallback);
				this.unbind("Change", this._updateBlocks);
				
				for (var i = 0; i < this._progressBarBlocks.length; i++) {
					var block = this._progressBarBlocks[i];
					block.destroy();
				}
				
			}
		});
		
		return this;
	}
});
