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
    * @sign public this .updateBarProgress(Number currentValue)
    * @param currentValue - The current progress. The value must be a 0 <= number <= maxValue 
    * representing the current progress.
    * @return this - The current entity for chaining.
    *
    * Update method to update the current progress of the progressbar.
    */
    updateBarProgress: function(val) {
        this._pbFilledFraction = val / this._pbMaxValue;
        if (this._pbFlipDirection)
            this._pbFilledFraction = 1 - this._pbFilledFraction;

        this._updateBarDimension();
        
        return this;
    },

    _updateBarDimension: function() {
        this._pbBlockWidth = this._w * this._pbFilledFraction;
        this._pbBlockHeight = this._h * this._pbFilledFraction;

        if (this._pbBlockWidth >= this._pbBlockHeight) {
            this._pbLowerBlock.attr({ x: this._x, y: this._y, 
                                      w: this._pbBlockWidth, h: this._h });

            this._pbHigherBlock.attr({ x: this._x + this._pbBlockWidth, y: this._y, 
                                       w: this._w - this._pbBlockWidth, h: this._h });
        } else {
            this._pbLowerBlock.attr({ x: this._x, y: this._y, 
                                      w: this._w, h: this._pbBlockHeight });

            this._pbHigherBlock.attr({ x: this._x, y: this._y + this._pbBlockHeight, 
                                       w: this._w, h: this._h - this._pbBlockHeight });
        }
        
        return this;
    },

    _updateBarOrder: function() {
        this._pbLowerBlock.z = this._z;
        this._pbHigherBlock.z = this._z;
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
    *   .attr({ x: 150, y : 140, w: 100, h: 25, z: 100 })
    *   .progressBar(100, false, "blue", "green");
    * ...
    * progressBar.updateBarProgress(someValue);
    * ~~~
    */
    progressBar : function(maxValue, flipDirection, emptyColor, filledColor) {
        this._pbMaxValue = maxValue;
        this._pbFlipDirection = flipDirection;
        var renderMethod = this.has("Canvas") ? "Canvas" : "DOM";

        
        this._pbLowerBlock = Crafty.e("2D, " + renderMethod + ", Color")
                    .color(flipDirection ? emptyColor : filledColor);
        this._pbHigherBlock = Crafty.e("2D, " + renderMethod + ", Color")
                    .color(flipDirection ? filledColor : emptyColor);
        this.attach(this._pbLowerBlock);
        this.attach(this._pbHigherBlock);

        this._updateBarDimension();
        this._updateBarOrder();

        this.bind("Resize", this._updateBarDimension);
        this.bind("reorder", this._updateBarOrder);
        this.bind("RemoveComponent", function(component) {
            if (component === "ProgressBar") {
                this.unbind("Resize", this._updateBarDimension);
                this.unbind("reorder", this._updateBarOrder);
                this.detach(this._pbLowerBlock);
                this.detach(this._pbHigherBlock)
                this._pbLowerBlock.destroy();
                this._pbHigherBlock.destroy();
            }
        });
        
        return this;
    }
});
