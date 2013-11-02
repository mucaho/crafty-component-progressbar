/**@
* #ProgressBar
* @category Custom
*
* Used to display the progress of a specific task (e.g. progress of asset loading, HP bar).
* Internally it creates two 2D blocks representing the empty and full part of the progress spectrum. 
* These blocks adjust their size with respect to the current progress. 
* Changes to the progress bar's 2D properties are reflected on to the blocks. 
* The blocks cut the bar along the highest progress bar's dimension 
* (blocks span horizontally if progressbar.width >= progressbar.height).
*
*/
Crafty.c("ProgressBar", {
	init: function(entity) {
		this.requires("2D");
		this._pbFilledFraction = 0;
	},
	
	/**@
	* #.updateBarProgress
	* @comp ProgressBar
	* @sign public void .updateBarProgress(Number currentProgress)
	* @param currentProgress - The current progress. The value must be a 0 <= number <= maxValue 
	* representing the current progress.
	* @return this - The current entity for chaining.
	*
	* Update method to update the current progress of the progressbar.
	*/
	updateBarProgress: function(val) {
		if (!(!!val && val >= 0 && val <= this._pbMaxValue)) {
			return;
		}
		
		this._pbFilledFraction = val / this._pbMaxValue;
		if (this._pbFlipDirection)
			this._pbFilledFraction = 1 - this._pbFilledFraction;
		
		this._updateBarDimension();
		
		return this;
	},
	
	_updateBarDimension: function() {
		this._pbBlockWidth = this.w * this._pbFilledFraction;
		this._pbBlockHeight = this.h * this._pbFilledFraction;
		
		if (this._pbBlockWidth >= this._pbBlockHeight) {
			this._pbLowerBlock.attr({ x: this.x, y: this.y, 
									w: this._pbBlockWidth, h: this.h, z: this.z });
			this._pbHigherBlock.attr({ x: this.x + this._pbBlockWidth, y: this.y, 
									w: this.w - this._pbBlockWidth, h: this.h, z: this.z });
		} else {
			this._pbLowerBlock.attr({ x: this.x, y: this.y, 
									w: this.w, h: this._pbBlockHeight, z: this.z });
			this._pbHigherBlock.attr({ x: this.x, y: this.y + this._pbBlockHeight, 
									w: this.w, h: this.h - this._pbBlockHeight, z: this.z });
		}
		
		return this;
	},
	/**@
	* #.progressBar
	* @comp ProgressBar
	* @sign public this .progressBar(Number maxValue, Boolean flipDirection, 
	* String emptyColor, String filledColor)
	* @param maxValue - The maximum value the incoming value can have.
	* @param flipDirection - Whether to flip the fill direction. False to fill blocks from left/top
	* to right/bottom. True to inverse.
	* @param emptyColor - The color for 2D blocks that are empty.
	* @param filledColor - The color for 2D blocks that are filled.
	* @return this - The current entity for chaining.
	*
	* Constructor method to setup the progress bar.
	*
	* @example
	* ~~~
	* var progressBar = Crafty.e("2D, DOM, ProgressBar")
	*	.attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
	*	.progressBar(100, false, "blue", "green");
	* ...
	* progressBar.updateBarProgress(someValue);
	* ~~~
	*/
	progressBar : function(maxValue, flipDirection, emptyColor, filledColor) {
		this._pbMaxValue = maxValue;
		this._pbFlipDirection = !!flipDirection;
		var renderMethod = this.has("Canvas") ? "Canvas" : "DOM";

		
		this._pbLowerBlock = Crafty.e("2D, " + renderMethod + ", Color")
					.color(flipDirection ? emptyColor : filledColor);
		this._pbHigherBlock = Crafty.e("2D, " + renderMethod + ", Color")
					.color(flipDirection ? filledColor : emptyColor);
		this._updateBarDimension();

		this.bind("Change", this._updateBarDimension);
		this.bind("RemoveComponent", function(component) {
			if (component === "ProgressBar") {
				this.unbind("Change", this._updateBarDimension);
				this._pbLowerBlock.destroy();
				this._pbHigherBlock.destroy();
			}
		});
		
		return this;
	}
});