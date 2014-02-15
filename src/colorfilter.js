goog.provide("ColorFilter");

goog.scope(function() {
	/**
	 * @constructor
	 * @param {!{coffsetRed, coffsetGreen, coffsetBlue, cfactorRed, cfactorGreen, cfactorBlue}} colors
	 */
	ColorFilter = function (colors) {
		/**
		 * @type {!{coffsetRed, coffsetGreen, coffsetBlue, cfactorRed, cfactorGreen, cfactorBlue}}
		 */
		this.colors = colors;
	};
	/**
	 * @type {!{coffsetRed, coffsetGreen, coffsetBlue, cfactorRed, cfactorGreen, cfactorBlue}}
	 */
	ColorFilter.prototype.colors;
	/**
	 * @param {(!HTMLCanvasElement|!Image)} img
	 * @return {!HTMLCanvasElement}
	 */
	ColorFilter.prototype.apply = function (img) {
		/**
		 * @type {?Number}
		 */
		var coffsetRed = (this.colors["coffsetRed"] !== undefined) ? this.colors["coffsetRed"] : null;
		/**
		 * @type {?Number}
		 */
		var coffsetGreen = (this.colors["coffsetGreen"] !== undefined) ? this.colors["coffsetGreen"] : null;
		/**
		 * @type {?Number}
		 */
		var coffsetBlue = (this.colors["coffsetBlue"] !== undefined) ? this.colors["coffsetBlue"] : null;
		/**
		 * @type {?Number}
		 */
		var cfactorRed = (this.colors["cfactorRed"] !== undefined) ? this.colors["cfactorRed"] : null;
		/**
		 * @type {?Number}
		 */
		var cfactorGreen = (this.colors["cfactorGreen"] !== undefined) ? this.colors["cfactorGreen"] : null;
		/**
		 * @type {?Number}
		 */
		var cfactorBlue = (this.colors["cfactorBlue"] !== undefined) ? this.colors["cfactorBlue"] : null;
		/**
		 * @type {number}
		 */
		var h = img.height || 0;
		/**
		 * @type {number}
		 */
		var w = img.width || 0;
		/**
		 * @type {!HTMLCanvasElement}
		 */
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", w);
		canvas.setAttribute("height", h);
		/**
		 * @type {!CanvasRenderingContext2D}
		 */
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		
		/**
		 * @type {!ImageData}
		 */
		var result = ctx.getImageData(0, 0, w, h);
		
		/**
		 * @type {!ImageData}
		 */
		var imageR;
		/**
		 * @type {!ImageData}
		 */
		var imageG;
		/**
		 * @type {!ImageData}
		 */
		var imageB;
		
		imageR = ctx.createImageData(w, h);
		imageG = ctx.createImageData(w, h);
		imageB = ctx.createImageData(w, h);
		
		/**
		 * @type {(!Array|!Uint8Array|!CanvasPixelArray)}
		 */
		var rPixels = imageR.data;
		/**
		 * @type {(!Array|!Uint8Array|!CanvasPixelArray)}
		 */
		var gPixels = imageG.data;
		/**
		 * @type {(!Array|!Uint8Array|!CanvasPixelArray)}
		 */
		var bPixels = imageB.data;
		
		for(var data = result.data, i = 0, len = data.length; i < len ; i+=4)
		{
			rPixels[i] = data[i];
			rPixels[i+1] = 0;
			rPixels[i+2] = 0;
			rPixels[i+3] = data[i+3];
			gPixels[i] =  0;
			gPixels[i+1] = data[i+1];
			gPixels[i+2] = 0;
			gPixels[i+3] = data[i+3];
			bPixels[i] = 0;
			bPixels[i+1] = 0;
			bPixels[i+2] = data[i+2];
			bPixels[i+3] = data[i+3];
		}
		
		/**
		 * @type {!HTMLCanvasElement}
		 */
		var workCanvas = document.createElement("canvas");
		workCanvas.setAttribute("width", w);
		workCanvas.setAttribute("height", h);
		/**
		 * @type {!CanvasRenderingContext2D}
		 */
		var workCtx = workCanvas.getContext("2d");
		workCtx.globalCompositeOperation = "lighter";
		workCtx.globalAlpha = 1.0;
		
		/**
		 * @type {!HTMLCanvasElement}
		 */
		var colorCanvas = document.createElement("canvas");
		colorCanvas.setAttribute("width", w);
		colorCanvas.setAttribute("height", h);
		/**
		 * @type {!CanvasRenderingContext2D}
		 */
		var colorCtx = colorCanvas.getContext("2d");
		colorCtx.globalCompositeOperation = "xor";
		
		/**
		 * @type {!HTMLCanvasElement}
		 */
		var filterCanvas = document.createElement("canvas");
		filterCanvas.setAttribute("width", w);
		filterCanvas.setAttribute("height", h);
		/**
		 * @type {!CanvasRenderingContext2D}
		 */
		var filterCtx = filterCanvas.getContext("2d");
		
		filterCtx.fillStyle = "rgb(0, 0, 0)";
		filterCtx.globalCompositeOperation = "source-over";
		filterCtx.fillRect(0, 0, w, h);
		filterCtx.globalCompositeOperation = "xor";
		filterCtx.drawImage(colorCanvas, 0, 0);
		filterCtx.fillStyle = "rgb(0, 0, " + coffsetBlue + ")";
		filterCtx.fillRect(0, 0, w, h);
		workCtx.globalAlpha = 1.0;
		workCtx.drawImage(filterCanvas, 0, 0);
	
		colorCtx.putImageData(imageR, 0, 0);

		if(cfactorRed !== null)
		{
			workCtx.globalAlpha = cfactorRed / 256;
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		else
		{
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		
		if(coffsetRed !== null)
		{
			filterCtx.fillStyle = "rgb(" + coffsetRed + ",0 ,0)";
			filterCtx.globalCompositeOperation = "source-over";
			filterCtx.fillRect(0, 0, w, h);
			filterCtx.globalCompositeOperation = "xor";
			filterCtx.drawImage(colorCanvas, 0, 0);
			filterCtx.fillStyle = "rgb(" + coffsetRed + ",0 ,0)";
			filterCtx.fillRect(0, 0, w, h);
			workCtx.globalAlpha = 1.0;
			workCtx.drawImage(filterCanvas, 0, 0);
		}
		
		colorCtx.putImageData(imageG, 0, 0);
		
		if(cfactorGreen !== null)
		{
			workCtx.globalAlpha = cfactorGreen / 256;
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		else
		{
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		
		if(coffsetGreen !== null)
		{
			filterCtx.fillStyle = "rgb(0, " + coffsetGreen + ", 0)";
			filterCtx.globalCompositeOperation = "source-over";
			filterCtx.fillRect(0, 0, w, h);
			filterCtx.globalCompositeOperation = "xor";
			filterCtx.drawImage(colorCanvas, 0, 0);
			filterCtx.fillStyle = "rgb(0, " + coffsetGreen + ", 0)";
			filterCtx.fillRect(0, 0, w, h);
			workCtx.globalAlpha = 1.0;
			workCtx.drawImage(filterCanvas, 0, 0);
		}
		
		colorCtx.putImageData(imageB, 0, 0);
		
		if(cfactorBlue !== null)
		{
			workCtx.globalAlpha = cfactorBlue / 256;
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		else
		{
			workCtx.drawImage(colorCanvas, 0, 0);
		}
		
		if(coffsetBlue !== null)
		{
			filterCtx.fillStyle = "rgb(0, 0, " + coffsetBlue + ")";
			filterCtx.globalCompositeOperation = "source-over";
			filterCtx.fillRect(0, 0, w, h);
			filterCtx.globalCompositeOperation = "xor";
			filterCtx.drawImage(colorCanvas, 0, 0);
			filterCtx.fillStyle = "rgb(0, 0, " + coffsetBlue + ")";
			filterCtx.fillRect(0, 0, w, h);
			workCtx.globalAlpha = 1.0;
			workCtx.drawImage(filterCanvas, 0, 0);
		}
		
		return workCanvas;
	};
});