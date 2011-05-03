// Cove Visual Javascript Library
// Visuals for Timeline Manipulation using jQuery and Canvas Support

// Timeline Framework

(function($) {
	function TimeLine(placeholder, data_, options_) {
		
		var ctx;
		var c_width;
		var c_height;
		
		if ($(placeholder)[0].tagName == "CANVAS") {
			ctx = $(placeholder)[0].getContext("2d");
			c_width = $(placeholder).width();
			c_height = $(placeholder).height();
						
		} else {
			if ($(placeholder).length > 0) {
				$(placeholder).text("CoVisual TimeLines require HTML5 Canvas Support");
			};
		};
		
		// Line Subfunction. options_ is a JSON object
		function line(start_x,series_number,options_) {
			ctx.lineWidth = 3;
			parseOptions(options_);
			ctx.beginPath();
			y = series_number*12 + 10; 
			ctx.moveTo(start_x, y);
			ctx.lineTo(start_x + l, y);
			ctx.stroke();
		};
		
		function label(labeltext, series_number, options_) {
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			parseOptions(options_);
			
			y = series_number*12 + 5; 
			ctx.fillText(labeltext,8, y);
		};
		
		// Option Parsing function. Escapes most javascript functions
		function parseOptions(opts) {
			$.each(opts, function(i,val) {
				escaped_var = i.replace(/[^A-Za-z0-9\.]/g,'');
				if (eval('ctx.' + escaped_var)) {
					eval('var ctx.' + escaped_var + ' = \'' + val + '\'')
				};
			});
		};
		
	};
});