/**@
* #ProgressBar
* @category Custom
* @bind CustomEvent - when the progress changes (must be triggered with a single Number representing the current progress)
*
* Used to display the progress of a specific task (e.g. progress of asset loading). Internally it creates small 2D elements representing
* a part of the progress spectrum. These elements are either empty or filled with respect to the current progress.
*
*/
Crafty.c("ProgressBar", {
  init: function(entity) {
		this._progressBarUnits = {};
	},
	/**@
	* #.progressBar
	* @comp ProgressBar
	* @sign public this .progressBar(String eventName, Number unitCount, Number maxValue, String emptyColor, String fullColor,
	* Number initX, Number initY, Number initZ, Number totalWidth, Number totalHeight, String renderMethod )
	* @param eventName - String of the event to listen to. Trigger the event directly on the entity the component gets applied to
	* or do trigger the event globally. The event object must be a 0 <= Number <= maxValue representing the current progress.
	* @param unitCount - Amount of units to split the progress bar to. A value of 10 would display progress in steps of 10%.
	* @param maxValue - The maximum value the incoming value can have.
	* @param emptyColor - The color for 2D elements that are empty.
	* @param fullColor - The color for 2D elementy that are filled.
	* @param initX - The initial X offset for the progress bar.
	* @param initY - The initial Y offset for the progress bar.
	* @param initZ - The Z offset for the progress bar.
	* @param totalWidth - The total width of the progress bar (each 2D element will have totalWidth/unitCount width).
	* @param totalHeight - The total height of the progress bar (each 2D element will have totalHeight height).
	* @param renderMethod - "DOM" or "Canvas" are allowed.
	* @return this - The current entity for chaining.
	*
	* Constructor method to setup the progress bar.
	*
	* @example
	* ~~~
    * Crafty.e("ProgressBar")
	*	.progressBar("LOADING_PROGRESS", 10, 100, "black", "white", 150, 140, 100, 100, 25);
	* ...
	* Crafty.trigger("LOADING_PROGRESS", someValue);
	* ~~~
	*/
	progressBar : function(eventName, unitCount, maxValue, emptyColor, fullColor, 
							initX, initY, initZ, totalWidth, totalHeight, renderMethod) {
		var unitWidth = totalWidth/units;
		var unitValue = maxValue/units;
		for (var i=0; i<units; i++) {
			this._progressBarUnits[i] = 
				Crafty.e("2D, Color, " + renderMethod)
					.attr({ x: initX + i*unitWidth, y: initY, 
							w: unitWidth, h: totalHeight, z: initZ, 
							_progressMin: unitValue*(i+1), _emptyColor: emptyColor, _fullColor: fullColor})
					.color(fullColor)
					.bind(eventName, function(e) {
						if (e >= this._progressMin)
							this.color(this._fullColor);
						else
							this.color(this._emptyColor);
					});
		}
		
		
		var progressCallback = function(event) {
			for (var key in this._progressBarUnits) {
				if ( this._progressBarUnits.hasOwnProperty(key) ) {
					var unit = this._progressBarUnits[key];
					unit.trigger(eventName, event);
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
