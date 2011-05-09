// Cove Visual Javascript Library
// Visuals for Timeline Manipulation using jQuery and Canvas Support

// Timeline Framework

// Color helper from FLOT (github.com/flot/flot), originally inspired by jQuery color animation plugin by John Resig
(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);


(function($) {
	function TimeLine(placeholder, data_, options_) {
		
		var ctx;
		var c_width;
		var c_height;
		var fill_list = {};
		var color_list = [];
		
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
			ctx.closePath();
		};
		
		function point(x,y,series_number,options_) {
			var radius = 2;
			fillSelector(series_number);
			parseOptions(options_);
			ctx.beginPath();
			ctx.arc(x,y,radius,0,Math.PI*2,true) // arc(x,y,radius,startAngle,endAngle,clockwise)
			ctx.closePath();
			ctx.fill();
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
				} else if eval(escaped_var) {
					eval('var ' + escaped_var + ' = \'' + val + '\'')
				};
				
			});
		};
		
		// Fill Generator from FLOT (see https://github.com/flot/flot)
		
		function fillGenerator(number) {
			var colors = [], variation = 0;
			i = 0;
			needColors = number - color_list.length
			while (colors.length < neededColors) {
			    var c;
			    if (color_list.length == i) // check degenerate case
			        c = $.color.make(100, 100, 100);
			    else
			        c = $.color.parse(options.colors[i]);
            
			    // vary color if needed
			    var sign = variation % 2 == 1 ? -1 : 1;
			    c.scale('rgb', 1 + sign * Math.ceil(variation / 2) * 0.2)
            
			    // FIXME: if we're getting to close to something else,
			    // we should probably skip this one
			    colors.push(c);
            
			    ++i;
			    if (i >= color_list.length) {
			        i = 0;
			        ++variation;
			    }
			}
			$.each(colors, function(obj) {
				color_list.push(obj)
			});
		};
		
	};
})(jQuery);